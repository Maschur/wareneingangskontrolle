"use client";

import { useState, useTransition } from "react";
import { addArticle, deleteArticle } from "@/lib/actions";

export default function ArticleList({
  articles,
}: {
  articles: { id: string; name: string }[];
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!name.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await addArticle(name.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setName("");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteArticle(id);
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
          placeholder="Neuer Artikel (z. B. Laptop, Kabel)…"
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
        {articles.map((a) => (
          <div key={a.id} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
            <span className="flex-1 text-sm font-medium text-gray-800">{a.name}</span>
            <button
              type="button"
              onClick={() => handleDelete(a.id)}
              disabled={isPending}
              className="text-xs text-danger font-medium hover:underline disabled:opacity-40"
            >
              Löschen
            </button>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Noch keine Artikel angelegt</p>
        )}
      </div>
    </div>
  );
}
