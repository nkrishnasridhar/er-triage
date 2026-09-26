"use client";
import { useActionState } from "react";
import { signIn } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";

export function LoginForm() {
  const [state, submit, pending] = useActionState(signIn, {});
  return (
    <form action={submit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email address
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={fieldClass}
          />
        </div>
      </div>
      <Button type="submit" size="xl" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Open workspace"}
      </Button>
      <p role="alert" aria-live="polite" className="text-sm leading-6">
        {state.error}
      </p>
    </form>
  );
}
