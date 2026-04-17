"use client";

import Link from "next/link";

export default function PrintActions({ id }: { id: string }) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 print:hidden">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link
          href={`/entries/${id}`}
          className="text-sm text-gray-600 font-medium"
        >
          ← Zurück
        </Link>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-magenta text-white rounded-lg text-sm font-semibold"
        >
          Drucken / PDF
        </button>
      </div>
    </div>
  );
}
