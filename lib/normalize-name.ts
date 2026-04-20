/**
 * Normalizes EPA SDWIS utility names from suffix format to prefix format.
 * e.g. "SAN DIEGO, CITY OF"  → "City of San Diego"
 *      "WINDSOR, TOWN OF"    → "Town of Windsor"
 *      "PHOENIX CITY OF"     → "City of Phoenix"
 *      "BLYTHE - CITY OF"    → "City of Blythe"
 *      "CITY OF FRESNO"      → "City of Fresno"  (already correct, just title-cases)
 */

const LOWER_WORDS = new Set(["of", "the", "and", "an", "a", "in", "on", "at", "for", "to", "by"]);

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => {
      if (i > 0 && LOWER_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const SUFFIX_PATTERNS: Array<{ re: RegExp; prefix: string }> = [
  { re: /[, \-]+CITY OF$/i,     prefix: "City of" },
  { re: /[, \-]+TOWN OF$/i,     prefix: "Town of" },
  { re: /[, \-]+COUNTY OF$/i,   prefix: "County of" },
  { re: /[, \-]+TOWNSHIP OF$/i, prefix: "Township of" },
  { re: /[, \-]+VILLAGE OF$/i,  prefix: "Village of" },
  { re: /[, \-]+BOROUGH OF$/i,  prefix: "Borough of" },
];

export function normalizeName(raw: string): string {
  for (const { re, prefix } of SUFFIX_PATTERNS) {
    if (re.test(raw)) {
      const cityPart = raw.replace(re, "").trim();
      return `${prefix} ${toTitleCase(cityPart)}`;
    }
  }
  return toTitleCase(raw);
}

export function normalizeSlug(raw: string): string {
  return normalizeName(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
