"use client";

import Link from "next/link";
import { useState } from "react";
import MenuDrawer from "@/components/MenuDrawer";
import { USER_PROFILE } from "@/lib/constants";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="bg-magenta text-white px-4 py-4 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold leading-tight">Wareneingangskontrolle</h1>
            <p className="text-xs text-white/80">Prüf- & Erfassungssystem</p>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0 hover:bg-white/30 transition"
            title="Menü"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* User Profile Card */}
      <section className="bg-gradient-to-b from-magenta to-magenta-dark text-white px-4 pt-6 pb-14">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {USER_PROFILE.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{USER_PROFILE.username}</h2>
                <p className="text-sm text-white/80">{USER_PROFILE.company}</p>
                <p className="text-xs text-white/60 mt-0.5">
                  Personalnr. {USER_PROFILE.personnelNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <main className="flex-1 px-4 -mt-7">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Neue Prüfung */}
          <Link href="/new" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 active:scale-[0.98] transition-transform">
            <div className="w-14 h-14 bg-magenta/10 rounded-xl flex items-center justify-center text-magenta shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800">Neue Prüfung starten</h3>
              <p className="text-sm text-gray-600 mt-0.5">Wareneingang kontrollieren & dokumentieren</p>
            </div>
            <ChevronRight />
          </Link>

          {/* Einträge */}
          <Link href="/entries" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 active:scale-[0.98] transition-transform">
            <div className="w-14 h-14 bg-magenta/10 rounded-xl flex items-center justify-center text-magenta shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800">Einträge anzeigen</h3>
              <p className="text-sm text-gray-600 mt-0.5">Alle Prüfungen durchsuchen & drucken</p>
            </div>
            <ChevronRight />
          </Link>

          {/* Statistik */}
          <Link href="/stats" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 active:scale-[0.98] transition-transform">
            <div className="w-14 h-14 bg-magenta/10 rounded-xl flex items-center justify-center text-magenta shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800">Statistik & Muster</h3>
              <p className="text-sm text-gray-600 mt-0.5">Auswertungen, Schadensquoten & Trends</p>
            </div>
            <ChevronRight />
          </Link>

          {/* Einstellungen */}
          <Link href="/settings" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 active:scale-[0.98] transition-transform">
            <div className="w-14 h-14 bg-magenta/10 rounded-xl flex items-center justify-center text-magenta shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800">Einstellungen</h3>
              <p className="text-sm text-gray-600 mt-0.5">Lieferanten, Dark Mode & mehr</p>
            </div>
            <ChevronRight />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-4 py-4 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-gray-400">Wareneingangskontrolle v2.0 · Internes Prüfsystem</p>
        </div>
      </footer>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
