// The Prisma client that public pages get when they `import { prisma } from "@/lib/prisma"`.
//
// next.config.ts swaps "@/lib/prisma" for this file in production builds for
// everything under app/ except app/admin and app/api, so public pages read
// through the 7-day cache in lib/prisma-cached.ts without changing their
// imports. Admin pages, API routes, cron jobs, lib/ code and scripts still get
// the plain, always-fresh client. (Dev uses Turbopack, where the swap doesn't
// apply, so local dev always reads fresh data.)
export { prismaCached as prisma, prismaCached as default } from "./prisma-cached";
