#!/bin/bash
# Quick 404 smoke test. Usage: ./scripts/check-404s.sh [base_url]
# Default base: http://localhost:3000

BASE="${1:-http://localhost:3000}"
FAIL=0

check() {
  local url="$BASE$1"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" = "404" ]; then
    echo "FAIL 404: $1"
    FAIL=1
  elif [ "$status" = "200" ] || [ "$status" = "307" ] || [ "$status" = "308" ]; then
    echo "OK  $status: $1"
  else
    echo "WARN $status: $1"
  fi
}

echo "=== 404 smoke test against $BASE ==="

# Core pages
check "/"
check "/pfas-watchlist"
check "/states"
check "/cities"
check "/contaminants"

# PFAS analytes (plain, mixed-case, and special chars)
check "/pfas-watchlist/analyte/PFOA"
check "/pfas-watchlist/analyte/PFOS"
check "/pfas-watchlist/analyte/PFNA"
check "/pfas-watchlist/analyte/$(python3 -c 'import urllib.parse; print(urllib.parse.quote("11Cl-PF3OUdS"))')"
check "/pfas-watchlist/analyte/$(python3 -c 'import urllib.parse; print(urllib.parse.quote("6:2FTS"))')"

# State pages
check "/pfas-watchlist/california"
check "/pfas-watchlist/texas"
check "/states/california"

echo ""
if [ $FAIL -eq 0 ]; then
  echo "All checks passed."
else
  echo "One or more pages returned 404."
  exit 1
fi
