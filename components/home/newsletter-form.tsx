"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "error" | "success";

/** Newsletter sign-up. Client-side validation only — no backend yet. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputId = useId();
  const messageId = useId();
  const hintId = useId();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setStatus("error");
      setMessage("That email doesn’t look quite right. Please check it, e.g. name@example.com.");
      return;
    }

    setStatus("success");
    setMessage("Thank you, you’re on the list.");
    setEmail("");
  }

  const invalid = status === "error";

  return (
    <form noValidate onSubmit={handleSubmit} className="w-full">
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      {/* Field and button side by side from sm. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <input
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          placeholder="name@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") {
              setStatus("idle");
              setMessage("");
            }
          }}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? messageId : hintId}
          className={cn(
            "h-14 w-full min-w-0 flex-1 rounded-none border-0 border-b bg-transparent px-0 font-display text-[1.375rem] text-ink transition-colors duration-300 placeholder:text-ink/35 focus:outline-none focus-visible:outline-none",
            // Invalid: a maroon rule doubled in weight.
            invalid
              ? "border-maroon shadow-[0_1px_0_0_var(--color-maroon)]"
              : "border-ink/25 hover:border-ink/60 focus:border-ink focus:shadow-[0_1px_0_0_var(--color-ink)]",
          )}
        />
        <button
          type="submit"
          className="btn btn-ink shrink-0"
        >
          Subscribe
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p id={hintId} className="mt-4 text-[13px] leading-relaxed text-stone">
        One letter a month. Unsubscribe at any time.
      </p>

      <div aria-live="polite" aria-atomic="true" className="min-h-7">
        {message ? (
          <p
            id={messageId}
            className={cn(
              "mt-3 flex items-start gap-3 text-ink",
              status === "success" ? "font-display text-[1.25rem] italic" : "text-[15px]",
            )}
          >
            {/* Decorative marker only. */}
            <span
              aria-hidden="true"
              className={cn("mt-[0.7em] inline-block h-px shrink-0 bg-maroon", status === "success" ? "w-8" : "w-5")}
            />
            {status === "error" ? <span className="sr-only">Error: </span> : null}
            <span>{message}</span>
          </p>
        ) : null}
      </div>
    </form>
  );
}
