const COOKIE_NAME = "wur_admin";

export function requireAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  const token = match ? match.slice(COOKIE_NAME.length + 1) : undefined;
  return token === process.env.ADMIN_PASSWORD;
}

export function requireCronSecret(request: Request): boolean {
  const auth = request.headers.get("authorization") ?? "";
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export function requireAdminOrCron(request: Request): boolean {
  return requireAdmin(request) || requireCronSecret(request);
}
