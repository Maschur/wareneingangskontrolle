"use client";

import { useState, useTransition } from "react";
import { addSupplier, deleteSupplier, updateSupplierEmail } from "@/lib/actions";

export default function SupplierList({
  suppliers,
}: {
  suppliers: { id: string; name: string; email?: string | null }[];
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [emailVal, setEmailVal] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await addSupplier(name.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setName("");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSupplier(id);
    });
  }

  function startEditEmail(s: { id: string; email?: string | null }) {
    setEditingEmail(s.id);
    setEmailVal(s.email || "");
  }

  function handleSaveEmail(id: string) {
    startTransition(async () => {
      await updateSupplierEmail(id, emailVal.trim());
      setEditingEmail(null);
    });
  }

  return (
    <div className="space-y-4">
      {/* Add form */}
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Neuer Lieferant…"
          className="input flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || !name.trim()}
          className="px-5 py-3 bg-magenta text-white rounded-xl text-sm font-semibold disabled:opacity-40 transition shrink-0"
        >
          {isPending ? "…" : "Hinzufügen"}
        </button>
      </div>

      {error && <p className="text-sm text-danger font-medium">{error}</p>}

      {/* List */}
      <div className="space-y-2">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">{s.name}</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => startEditEmail(s)} className="text-xs text-magenta hover:underline">
                  {s.email ? "E-Mail ändern" : "E-Mail hinzufügen"}
                </button>
                <button type="button" onClick={() => handleDelete(s.id)} disabled={isPending} className="text-xs text-gray-400 hover:text-danger transition disabled:opacity-40">
                  Entfernen
                </button>
              </div>
            </div>
            {s.email && editingEmail !== s.id && (
              <p className="text-xs text-gray-500 mt-1">{s.email}</p>
            )}
            {editingEmail === s.id && (
              <div className="flex gap-2 mt-2">
                <input
                  type="email"
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEmail(s.id)}
                  placeholder="lieferant@example.com"
                  className="input flex-1 !py-2 text-xs"
                  autoFocus
                />
                <button type="button" onClick={() => handleSaveEmail(s.id)} disabled={isPending} className="px-3 py-2 bg-magenta text-white rounded-lg text-xs font-semibold disabled:opacity-40">
                  Speichern
                </button>
                <button type="button" onClick={() => setEditingEmail(null)} className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600">
                  Abbrechen
                </button>
              </div>
            )}
          </div>
        ))}
        {suppliers.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Keine Lieferanten vorhanden.</p>
        )}
      </div>
    </div>
  );
}
