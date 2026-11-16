"use client";

import { useActionState, useId } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const initial: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <form action={action} className="space-y-6" noValidate>
      <div>
        <label htmlFor={`${id}-password`} className="eyebrow block text-stone">
          Password
        </label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          disabled={pending}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? errorId : undefined}
          className="mt-2 block w-full rounded-none border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-[17px] text-ink outline-none transition-colors focus:border-maroon disabled:opacity-60"
        />
      </div>

      <p id={errorId} role="alert" aria-live="polite" className="min-h-5 text-sm text-maroon">
        {state.error}
      </p>

      <button type="submit" disabled={pending} className="btn btn-ink w-full disabled:cursor-wait disabled:opacity-70">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
