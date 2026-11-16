import { PageThread } from "@/components/motion/page-transition";

/**
 * Templates remount on every navigation, so this gives each page a soft
 * fade-in (CSS, so it also works before hydration) plus the signature
 * maroon thread sweeping across the top.
 *
 * Opacity-only on purpose: a transform here would become the containing
 * block for any `position: fixed` element inside the page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageThread />
      <div className="animate-page-in">{children}</div>
    </>
  );
}
