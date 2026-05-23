## Deploy verification rule (mandatory)

Before reporting any feature or deploy as "complete":
1. Run `git status` — must show clean working tree.
2. Run `git log --oneline -1` — confirm latest commit includes the new work.
3. Run `vercel --prod` and capture deploy URL.
4. For each new public URL, run `curl -o /dev/null -s -w "%{http_code}\n" {url}` and confirm 200.
5. For at least one new URL, grep the page HTML for a unique expected string (e.g. a heading, a route-specific element).
6. Report all four checks explicitly. Never report "complete" based on local file existence or build success alone.

Commit and push CLAUDE.md.
