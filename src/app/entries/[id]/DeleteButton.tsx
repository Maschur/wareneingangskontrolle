"use client";

import { deleteInspection } from "@/lib/actions";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => deleteInspection(id)}
          className="px-4 py-3 rounded-xl bg-danger text-white text-sm font-semibold"
        >
          Löschen
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600"
        >
          Abbrechen
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600"
    >
      Löschen
    </button>
  );
}
