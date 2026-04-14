/**
 * check-links.ts
 * Scans all TypeScript/TSX source files for:
 *   1. External URLs — HEAD/GET checks for 4xx/5xx and soft 404s
 *   2. Internal href="/..." links — verifies a matching page.tsx exists in the app/ directory
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
    console.log("\n✗  EXTERNAL FAILURES:");
    for (const r of failures) {
      console.log(`  [${r.status ?? r.error}] ${r.url}`);
      for (const f of r.files) console.log(`       → ${f}`);
    }
  }

  // ── Internal link check ─────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(80));
  console.log("Checking internal links...");
  console.log("=".repeat(80) + "\n");

  const INTERNAL_HREF_REGEX = /href=["'](\/[^"'#?][^"']*?)["']/g;
  // Segments that are dynamic (contain [param]) — skip these
  const isDynamic = (route: string) => /\[/.test(route);
  // Patterns that are clearly not page routes
  const isAsset = (route: string) => /\.(xml|txt|ico|png|jpg|svg|json)$/.test(route);

  const internalToFiles = new Map<string, Set<string>>();
  for (const file of allFiles) {
    const relFile = path.relative(PROJECT_ROOT, file);
    if (SKIP_FILES.has(relFile)) continue;
    const content = fs.readFileSync(file, "utf-8");
    let m: RegExpExecArray | null;
    INTERNAL_HREF_REGEX.lastIndex = 0;
    while ((m = INTERNAL_HREF_REGEX.exec(content)) !== null) {
      const href = m[1].split("?")[0].split("#")[0]; // strip query/hash
      if (!internalToFiles.has(href)) internalToFiles.set(href, new Set());
      internalToFiles.get(href)!.add(relFile);
    }
  }

  const APP_DIR = path.join(PROJECT_ROOT, "app");
  function routeExists(href: string): boolean {
    // Check app/<route>/page.tsx or app/<route>.tsx
    const segments = href.replace(/^\//, "").split("/");
    // Dynamic segments — skip
    if (segments.some((s) => s.startsWith("["))) return true;
    const dirPage = path.join(APP_DIR, ...segments, "page.tsx");
    const filePage = path.join(APP_DIR, ...segments.slice(0, -1), `${segments[segments.length - 1]}.tsx`);
    return fs.existsSync(dirPage) || fs.existsSync(filePage);
  }

  const internalFailures: { href: string; files: string[] }[] = [];
  for (const [href, files] of internalToFiles) {
    if (isAsset(href)) continue;
    if (isDynamic(href)) continue;
    const exists = routeExists(href);
    const label = exists ? "✓" : "✗ MISSING";
    console.log(`  ${label}  ${href}`);
    if (!exists) internalFailures.push({ href, files: [...files] });
  }

  if (internalFailures.length) {
    console.log("\n✗  MISSING INTERNAL ROUTES:");
    for (const r of internalFailures) {
      console.log(`  ${r.href}`);
      for (const f of r.files) console.log(`       → ${f}`);
    }
  }

  const totalFailed = failures.length + internalFailures.length;
  console.log(`\n${"=".repeat(80)}`);
  console.log(`Final: ${totalFailed === 0 ? "ALL PASSED" : `${totalFailed} issue(s) found`}`);
  console.log("=".repeat(80) + "\n");

  if (totalFailed > 0) {
    console.log("Fix these before deploying.\n");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("check-links fatal error:", err);
  process.exit(1);
});
