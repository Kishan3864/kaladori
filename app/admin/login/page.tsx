import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/layout/logo";
import { adminConfigured, isAdmin } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLoginPage() {
  return (
    <div className="shell py-12 md:py-20">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center">
        <div className="w-44">
          <Logo layout="stacked" href={null} />
        </div>
        <div className="mt-10 w-full border border-line bg-ivory p-6 md:p-8">
          <p className="eyebrow text-maroon">Admin</p>
          <h1 className="mt-3 font-display text-3xl">Sign in</h1>
          <Suspense fallback={<div className="mt-8 h-40 animate-pulse bg-sand/50" aria-hidden />}>
            <LoginGate />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-stone">For KalaDori staff only.</p>
      </div>
    </div>
  );
}

async function LoginGate() {
  await connection();
  if (await isAdmin()) redirect("/admin");

  if (!adminConfigured()) {
    return (
      <p role="alert" className="mt-6 border-l-2 border-maroon bg-sand/50 px-4 py-3 text-sm leading-relaxed text-ink">
        Admin access is not configured — set <code className="font-mono text-[13px]">ADMIN_PASSWORD</code> on the
        server.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <LoginForm />
    </div>
  );
}
