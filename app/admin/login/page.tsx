import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Droplets } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — Water Utility Report",
  robots: { index: false, follow: false },
};

async function loginAction(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme";

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("wur_admin", adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-wur-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-wur-teal flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold leading-none">WUR Admin</p>
            <p className="text-white/40 text-xs mt-0.5">Content CMS</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="font-display text-xl text-foreground mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter the admin password to continue.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-wur-danger-bg border border-wur-danger-border text-wur-danger text-sm">
              Incorrect password. Try again.
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoFocus
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/40 focus:border-wur-teal"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full h-10 bg-wur-teal text-white rounded-lg text-sm font-semibold hover:bg-wur-teal/90 transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/25 mt-6">
          Water Utility Report · Admin only
        </p>
      </div>
    </div>
  );
}
