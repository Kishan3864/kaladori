"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Submit button that disables itself while its form's server action runs,
 * and can ask for confirmation first (e.g. cancel order / delete message).
 */
export function SubmitButton({
  children,
  pendingLabel,
  confirm,
  className,
  name,
  value,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  confirm?: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending, data } = useFormStatus();
  // Only the clicked button shows its pending label when a form has several.
  const mine = pending && (!name || data?.get(name) === value);

  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      aria-busy={mine || undefined}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
      className={cn("disabled:cursor-wait disabled:opacity-60", className)}
    >
      {mine && pendingLabel ? pendingLabel : children}
    </button>
  );
}
