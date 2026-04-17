"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="bg-magenta text-white px-4 py-6 shadow-md">
        <div className="max-w-sm mx-auto text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Wareneingangskontrolle</h1>
          <p className="text-sm text-white/80 mt-1">Bitte anmelden</p>
        </div>
      </header>

      {/* Login form */}
      <main className="flex-1 flex items-start justify-center px-4 py-10 bg-gray-50">
        <form
          action={formAction}
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-5"
        >
          {state?.error && (
            <div className="bg-danger/10 text-danger text-sm rounded-lg px-4 py-3 font-medium">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5">
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              placeholder="name@telekom.de"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-magenta/40 focus:border-magenta transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1.5">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-magenta/40 focus:border-magenta transition"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-magenta hover:bg-magenta-dark text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {pending ? "Anmelden …" : "Anmelden"}
          </button>

          <p className="text-xs text-gray-400 text-center pt-2">
            Deutsche Telekom &middot; Interne Anwendung
          </p>
        </form>
      </main>
    </div>
  );
}
