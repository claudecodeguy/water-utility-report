# Outreach Pipeline — Setup Guide

## Environment variables (set in Vercel Dashboard → Settings → Environment Variables)

| Variable | Description |
|---|---|
| `OUTREACH_FROM_EMAIL` | Verified Resend sender address, e.g. `desk@waterutilityreport.com` |
| `OUTREACH_REPLY_TO` | Inbox that receives journalist replies, e.g. `replies@waterutilityreport.com` |
| `RESEND_WEBHOOK_SECRET` | From Resend Dashboard → Webhooks → your endpoint → Signing Secret (starts `whsec_`) |
| `REPLY_WEBHOOK_SECRET` | A random string you generate — must match what your forwarding service sends |
| `BING_SEARCH_API_KEY` | Azure Cognitive Services → Bing Search v7 key |
| `CRON_SECRET` | Long random string; passed as `Authorization: Bearer` by Vercel cron and your curl calls |

---

## Resend setup

### 1. Verify your sending domain

In [Resend Dashboard → Domains](https://resend.com/domains), verify `waterutilityreport.com` by adding the DNS records shown. Once verified, you can send from any address on that domain.

### 2. Configure the delivery webhook

In Resend Dashboard → Webhooks → Add Endpoint:
- URL: `https://waterutilityreport.com/api/outreach/webhook/resend`
- Events: `email.bounced`, `email.complained`, `email.delivered`
- Copy the **Signing Secret** (starts `whsec_`) → set as `RESEND_WEBHOOK_SECRET` in Vercel

---

## Reply capture setup

Replies go to `OUTREACH_REPLY_TO`. Because Resend doesn't parse inbound email, you need a forwarding layer:

### Option A — Cloudflare Email Routing + Worker (recommended, free)

1. In Cloudflare → Email Routing, add a rule: `replies@waterutilityreport.com` → forward to a Worker.
2. Deploy a Cloudflare Worker that re-posts the email to your webhook:

```javascript
export default {
  async email(message, env) {
    const parser = new EmailMessage(message); // use postal-mime or similar
    const body = await parser.text();
    await fetch("https://waterutilityreport.com/api/outreach/webhook/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Reply-Webhook-Secret": env.REPLY_WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        from_email: message.from,
        subject: message.headers.get("subject") ?? "",
        body,
        in_reply_to: message.headers.get("in-reply-to") ?? undefined,
        references: message.headers.get("references") ?? undefined,
      }),
    });
  },
};
```

3. Set `REPLY_WEBHOOK_SECRET` as a Worker secret (same value as in Vercel).

### Option B — Postmark Inbound Parse

1. Create a Postmark server with an inbound address.
2. Set MX record for `replies.waterutilityreport.com` to Postmark's inbound MX.
3. In Postmark → Inbound → Webhook URL: `https://waterutilityreport.com/api/outreach/webhook/reply`
4. Your Worker/handler needs to translate Postmark's format to the schema above and add the `X-Reply-Webhook-Secret` header.

### Option C — SendGrid Inbound Parse

Similar to Postmark — configure MX, set the parse webhook URL, translate the multipart payload.

---

## Backlink checker setup (optional)

1. Create an Azure account → Cognitive Services → Bing Search v7 → get API key.
2. Set `BING_SEARCH_API_KEY` in Vercel.
3. The checker runs every Monday at 9am UTC via the `check-backlinks` cron.

Without the key, the checker logs a TODO and exits cleanly — no crashes.

---

## Go-live checklist

- [ ] `OUTREACH_FROM_EMAIL` set to a verified Resend domain address
- [ ] `OUTREACH_REPLY_TO` inbox exists and can receive mail
- [ ] Resend webhook endpoint configured, `RESEND_WEBHOOK_SECRET` set
- [ ] Reply forwarding configured (Cloudflare Worker or Postmark), `REPLY_WEBHOOK_SECRET` set
- [ ] `ANTHROPIC_API_KEY` set in Vercel production env
- [ ] `CRON_SECRET` set (same value in Vercel and your local `.env.local`)
- [ ] `OUTREACH_ENABLED=true` set in Vercel production env
- [ ] At least one journalist imported via `/admin/outreach/journalists`
- [ ] Run `/api/outreach/detect` + `/api/outreach/score` manually once to seed signals
