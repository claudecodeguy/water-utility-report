/**
 * check-links.ts
 * Scans all TypeScript/TSX source files for external URLs and verifies
 * each one returns a non-error HTTP status code.
 *
 * Run: npx tsx scripts/check-links.ts
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const PROJECT_ROOT = path.resolve(__dirname, "..");

// Directories to scan for source files
const SCAN_DIRS = ["app", "lib", "components"];
// File extensions to include
const EXTENSIONS = [".ts", ".tsx"];
// Directories to skip
const SKIP_DIRS = new Set(["node_modules", ".next", "generated"]);

// Files to skip entirely (legacy/mock data — not rendered on any published page)
const SKIP_FILES = new Set(["lib/mock-data.ts"]);

// Regex to extract URLs from source strings (quoted or template literal URLs)
const URL_REGEX = /https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/g;

// Bot-blocked domains that return 403 for curl but work in browsers — skip these
const BOT_BLOCKED_DOMAINS = new Set([
  "cdc.gov",
  "azdeq.gov",
]);

// URLs to skip (known redirects, auth-required, or internal test URLs)
const SKIP_URLS = new Set([
  "https://waterutilityreport.com", // our own domain
]);

interface LinkResult {
  url: string;
  status: number | null;
  ok: boolean;
  files: string[];
  error?: string;
}

function collectFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractUrls(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const matches = content.match(URL_REGEX) ?? [];
  // Clean up trailing punctuation that might have been captured
  return matches.map((u) => u.replace(/[`"',)}\]]+$/, "")).filter(Boolean);
}

// Patterns that indicate a soft 404 (page returns 200 but shows an error)
const SOFT_404_PATTERNS = [
  /ERR-\d+ Could not determine workspace/i,
  /Sorry, this page isn.t available/i,
  /Page Not Found/i,
  /404 Not Found/i,
  /This page does not exist/i,
  /The page you requested could not be found/i,
];

function checkUrl(url: string): Promise<{ status: number | null; error?: string }> {
  return new Promise((resolve) => {
    const timeout = 15_000;
    const lib = url.startsWith("https") ? https : http;

    // For URLs with query params (deep links), do a GET so we can inspect the body for soft 404s
    const needsBodyCheck = url.includes("?");
    const method = needsBodyCheck ? "GET" : "HEAD";

    try {
      const req = lib.request(
        url,
        {
          method,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,*/*",
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
            res.resume();
            resolve({ status: res.statusCode });
            return;
          }

          if (!needsBodyCheck || res.statusCode !== 200) {
            res.resume();
            resolve({ status: res.statusCode ?? null });
            return;
          }

          // Read body to check for soft 404s
          let body = "";
          res.setEncoding("utf-8");
          res.on("data", (chunk: string) => {
            body += chunk;
            if (body.length > 50_000) res.destroy(); // stop after 50KB
          });
          res.on("end", () => {
            const softError = SOFT_404_PATTERNS.find((p) => p.test(body));
            if (softError) {
              resolve({ status: 200, error: `soft-404: matched "${softError.source}"` });
            } else {
              resolve({ status: 200 });
            }
          });
          res.on("close", () => {
            // body read was cut short (50KB limit) — treat as OK
            if (!body) resolve({ status: 200 });
          });
        }
      );
      req.setTimeout(timeout, () => {
        req.destroy();
        resolve({ status: null, error: "timeout" });
      });
      req.on("error", (err) => resolve({ status: null, error: err.message }));
      req.end();
    } catch (err: unknown) {
      resolve({ status: null, error: String(err) });
    }
  });
}

function isBotBlocked(url: string): boolean {
  return [...BOT_BLOCKED_DOMAINS].some((domain) => url.includes(domain));
}

function isSkipped(url: string): boolean {
  if (SKIP_URLS.has(url)) return true;
  // Skip template literal fragments (contain ${ or end with bare $)
  if (url.includes("${") || /\$$/.test(url) || url.endsWith("=$")) return true;
  // Skip localhost / local dev
  if (/localhost|127\.0\.0\.1/.test(url)) return true;
  return false;
}

async function main() {
  const allFiles: string[] = [];
  for (const dir of SCAN_DIRS) {
    allFiles.push(...collectFiles(path.join(PROJECT_ROOT, dir)));
  }

  // Collect all unique URLs with the files they appear in
  const urlToFiles = new Map<string, Set<string>>();
  for (const file of allFiles) {
    const relFile = path.relative(PROJECT_ROOT, file);
    if (SKIP_FILES.has(relFile)) continue; // legacy mock data — not public-facing
    const urls = extractUrls(file);
    for (const url of urls) {
      if (!urlToFiles.has(url)) urlToFiles.set(url, new Set());
      urlToFiles.get(url)!.add(relFile);
    }
  }

  console.log(`\nFound ${urlToFiles.size} unique external URLs across ${allFiles.length} files.\n`);

  const results: LinkResult[] = [];
  let checked = 0;

  for (const [url, files] of urlToFiles) {
    if (isSkipped(url)) continue;

    process.stdout.write(`[${++checked}/${urlToFiles.size}] ${url.slice(0, 80)} ... `);

    if (isBotBlocked(url)) {
      process.stdout.write("SKIP (bot-blocked domain)\n");
      results.push({ url, status: 403, ok: true, files: [...files], error: "bot-blocked domain — likely OK for users" });
      continue;
    }

    const { status, error } = await checkUrl(url);
    const isSoft404 = status === 200 && error?.startsWith("soft-404");
    const ok = !isSoft404 && status !== null && status < 400;
    const label = isSoft404 ? `200 SOFT-404` : (status ?? "ERR");
    process.stdout.write(`${label} ${ok ? "✓" : "✗"}\n`);
    results.push({ url, status, ok, files: [...files], error });
  }

  const failures = results.filter((r) => !r.ok);
  const warnings = results.filter((r) => r.ok && r.status !== null && r.status >= 300);

  console.log("\n" + "=".repeat(80));
  console.log(`Results: ${results.length - failures.length} OK, ${failures.length} FAILED, ${warnings.length} redirects`);
  console.log("=".repeat(80));

  if (warnings.length) {
    console.log("\n⚠  REDIRECTS (review if permanent redirect needed):");
    for (const r of warnings) {
      console.log(`  [${r.status}] ${r.url}`);
      for (const f of r.files) console.log(`       → ${f}`);
    }
  }

  if (failures.length) {
    console.log("\n✗  FAILURES:");
    for (const r of failures) {
      console.log(`  [${r.status ?? r.error}] ${r.url}`);
      for (const f of r.files) console.log(`       → ${f}`);
    }
    console.log("\nFix these URLs before deploying.\n");
    process.exit(1);
  } else {
    console.log("\nAll checked links passed.\n");
  }
}

main().catch((err) => {
  console.error("check-links fatal error:", err);
  process.exit(1);
});
