#!/usr/bin/env bash
# run-states.sh — Full end-to-end build + publish pipeline for any list of states
#
# Usage: bash scripts/run-states.sh MA MD MN WI TN
#
# Steps per state:
#   1. build-state   (ingest utilities, violations, geo, fix-slugs, rescore, patch states.ts)
#   2. fix-compliance-status
#   3. fix-missing-dates  (with retry on EPA timeout)
#   4. patch-cities  (infer city_served from utility names for major cities)
#   5. publish
#   6. validate-state
# Then: vercel --prod

set -euo pipefail

STATES=("$@")
if [ ${#STATES[@]} -eq 0 ]; then
  echo "Usage: bash scripts/run-states.sh MA MD MN WI TN"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

# ── Helpers ──────────────────────────────────────────────────────────────────

run_step() {
  local label="$1"; shift
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶  $label"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  npx tsx "$@"
}

run_step_optional() {
  local label="$1"; shift
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶  $label (optional — continuing on failure)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  npx tsx "$@" || echo "  ⚠  Step failed but continuing: $label"
}

wait_for_db() {
  echo "  Waiting for DB to become reachable..."
  local tries=0
  until npx tsx -e "
    import 'dotenv/config';
    import { PrismaClient } from './lib/generated/prisma/client';
    import { PrismaPg } from '@prisma/adapter-pg';
    const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
    p.utility.count().then(() => p.\$disconnect()).catch(e => { p.\$disconnect(); process.exit(1); });
  " 2>/dev/null; do
    tries=$((tries + 1))
    if [ $tries -ge 24 ]; then  # 2 min max
      echo "  ✖  DB unreachable after 2 minutes. Aborting."
      exit 1
    fi
    echo "  DB not ready, retry $tries/24..."
    sleep 5
  done
  echo "  ✓ DB reachable"
}

# ── Per-state pipeline ────────────────────────────────────────────────────────

for STATE in "${STATES[@]}"; do
  STATE_UPPER=$(echo "$STATE" | tr '[:lower:]' '[:upper:]')
  LOG="$LOG_DIR/build-${STATE_UPPER}.log"

  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  STARTING: $STATE_UPPER"
  echo "  Log: $LOG"
  echo "════════════════════════════════════════════════════════════"

  (
    wait_for_db

    run_step      "1/7 build-state ($STATE_UPPER)"           "$ROOT/scripts/build-state.ts"            --state "$STATE_UPPER"
    run_step_optional "2/7 fix-missing-dates ($STATE_UPPER)"     "$ROOT/scripts/fix-missing-dates.ts"      --state "$STATE_UPPER"
    run_step      "3/7 publish ($STATE_UPPER)"               "$ROOT/scripts/publish.ts"                --state "$STATE_UPPER"
    run_step_optional "4/7 fix-compliance-status"                "$ROOT/scripts/fix-compliance-status.ts"
    run_step      "5/7 rescore-risk ($STATE_UPPER)"          "$ROOT/scripts/rescore-risk.ts"           --state "$STATE_UPPER"
    run_step      "6/7 patch-cities ($STATE_UPPER)"          "$ROOT/scripts/patch-cities.ts"           --state "$STATE_UPPER"
    run_step      "7/7 validate-state ($STATE_UPPER)"        "$ROOT/scripts/validate-state.ts"         --state "$STATE_UPPER"

    echo ""
    echo "✅  $STATE_UPPER COMPLETE"
  ) 2>&1 | tee "$LOG"

  # Check if state completed successfully
  if ! grep -q "✅  $STATE_UPPER COMPLETE" "$LOG"; then
    echo "✖  $STATE_UPPER FAILED — check $LOG"
    exit 1
  fi

  echo "✅  $STATE_UPPER done — log saved to $LOG"
done

# ── Deploy ───────────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  All states complete: ${STATES[*]}"
echo "  Deploying to production..."
echo "════════════════════════════════════════════════════════════"
cd "$ROOT" && vercel --prod

echo ""
echo "🚀  PIPELINE COMPLETE. All states live."
