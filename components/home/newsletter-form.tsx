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
      setMessage("That email doesn’t look quite right — please check it, e.g. name@example.com.");
      return;
    }

    setStatus("success");
    setMessage("Thank you — you’re on the list.");
    setEmail("");
  }

  const invalid = status === "error";

  return (
    <form noValidate onSubmit={handleSubmit} className="w-full">
      <label htmlFor={inputId} className="eyebrow block text-ivory/90">
        Email address
      </label>
      {/* Field and button sit side by side only where the column is wide enough (full width on sm, ≥1280px in the md grid). */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6 md:flex-col md:items-stretch md:gap-5 xl:flex-row xl:items-end xl:gap-6">
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
            "h-14 w-full min-w-0 flex-1 rounded-none border-0 border-b bg-transparent px-0 font-display text-[1.375rem] text-ivory transition-colors duration-300 placeholder:text-ivory/35 focus:outline-none focus-visible:outline-none md:text-[1.625rem]",
            // Invalid: a solid ivory rule doubled in weight (blush is only 2.5:1 on maroon).
            invalid
              ? "border-ivory shadow-[0_1px_0_0_var(--color-ivory)]"
              : "border-ivory/40 hover:border-ivory/70 focus:border-ivory focus:shadow-[0_1px_0_0_var(--color-ivory)]",
          )}
        />
        <button
          type="submit"
          className="btn shrink-0 border border-ivory bg-ivory text-ink hover:border-blush hover:bg-blush hover:text-ink focus-visible:outline-ivory"
        >
          Subscribe
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p id={hintId} className="mt-5 text-[13px] leading-relaxed text-ivory/85">
        One letter a month. Unsubscribe at any time.
      </p>

      <div aria-live="polite" aria-atomic="true" className="min-h-7">
        {message ? (
          <p
            id={messageId}
            className={cn(
              "mt-3 flex items-start gap-3 text-ivory",
              status === "success" ? "font-display text-[1.25rem] italic" : "text-[15px]",
            )}
          >
            {/* Decorative marker only; the message itself is ivory for contrast. */}
            <span
              aria-hidden="true"
              className={cn("mt-[0.7em] inline-block h-px shrink-0 bg-blush", status === "success" ? "w-8" : "w-5")}
            />
            {status === "error" ? <span className="sr-only">Error: </span> : null}
            <span>{message}</span>
          </p>
        ) : null}
      </div>
    </form>
  );
}
