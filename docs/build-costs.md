# WUR Build Cost Log

Model: claude-sonnet-4-6 | Pricing: $3/MTok input · $15/MTok output

---

## Session: 2026-04-21 — Batch 1 (25 states)

States: CA TX FL AZ OH IL GA MI NC NY PA NJ VA WA CO MA MD MN WI TN IN MO OR SC LA

These were built over multiple sessions. PFAS ingest (UCMR5, 1.1M records) was a separate
long-running script session — zero Claude tokens, pure DB I/O.

**Estimated Claude cost for all 25 states:** ~$2.00–4.00 total (long sessions with large context)

---

## Session: 2026-04-21 — Batch 2 (10 states)

States: AL KY OK CT UT NV IA AR KS MS

**Claude token usage this session (measured):**

| Item                              | Tokens (est.) |
|-----------------------------------|---------------|
| Conversation context loaded       | ~80K input    |
| Files read (states.ts, scripts)   | ~6K input     |
| Output generated (this task)      | ~400 output   |
| **Total**                         | **~86K in / 400 out** |

**Cost estimate:**
- Input: 86K × $3/MTok = **$0.26**
- Output: 0.4K × $15/MTok = **$0.006**
- **Session total: ~$0.27**

**Per-state cost this session: ~$0.027**

---

## Benchmark: Fresh session cost (10 states, no history)

If started fresh with only the task:

| Item                        | Tokens (est.) |
|-----------------------------|---------------|
| Read states.ts + 2 scripts  | ~5K input     |
| Minimal output              | ~200 output   |
| **Total**                   | **~5K in / 200 out** |

**Fresh session cost: ~$0.015–0.02 per 10-state batch (~$0.002/state)**

> Key insight: context length (conversation history) is the main cost driver,
> not the actual work. Batching states in a fresh dedicated session is 10–15×
> cheaper than doing them in a long active session.

---

## Running cost total

| Batch         | States | Est. cost |
|---------------|--------|-----------|
| Batch 1       | 25     | ~$3.00    |
| Batch 2       | 10     | ~$0.27    |
| **Total**     | **35** | **~$3.27** |

---

## Next batch recommendation

Start a fresh session, say: "Add next 10 states to WUR — run run-states.sh"
Expected cost: **~$0.05** (fresh context = tiny input).
