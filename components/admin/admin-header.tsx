import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";

const TABS = [
  { key: "orders", label: "Orders", href: "/admin" },
  { key: "messages", label: "Messages", href: "/admin/messages" },
] as const;

/** Static admin chrome: title, Orders | Messages tabs, sign-out. */
export function AdminHeader({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <div className="border-b border-line pb-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-maroon">KalaDori · Admin</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">Shop desk</h1>
        </div>
        <form action={logout}>
          <SubmitButton pendingLabel="Signing out…" className="eyebrow link-draw py-2 text-stone hover:text-ink">
            Sign out
          </SubmitButton>
        </form>
      </div>
      <nav aria-label="Admin sections" className="mt-6 flex gap-6">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={tab.key === active ? "page" : undefined}
            className={cn(
              "eyebrow -mb-[17px] border-b-2 pb-4 transition-colors",
              tab.key === active ? "border-maroon text-ink" : "border-transparent text-stone hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
