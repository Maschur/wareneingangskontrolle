import Link from "next/link";
import Header from "@/components/Header";
import { getInspections } from "@/lib/actions";
import { defectLabel } from "@/lib/constants";

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const entries = await getInspections(q);

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Einträge" back="/" />

      <div className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Search */}
          <form className="mb-4">
            <input
              name="q"
              type="search"
              defaultValue={q || ""}
              placeholder="Suchen nach Lieferant, Prüfer, Bestellnr.…"
              className="input"
            />
          </form>

          <p className="text-xs text-gray-400 mb-3">
            {entries.length} Einträge {q && `für „${q}"`}
          </p>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Noch keine Prüfungen erfasst</p>
              <Link href="/new" className="inline-block bg-magenta text-white px-6 py-3 rounded-xl text-sm font-semibold">
                Erste Prüfung starten
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => {
                const allDefects = [
                  ...entry.quantityDefects,
                  ...entry.identityDefects,
                  ...entry.qualityDefects,
                  ...entry.documentDefects,
                ];
                const hasDefects = allDefects.length > 0;

                return (
                  <Link
                    key={entry.id}
                    href={`/entries/${entry.id}`}
                    className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 active:scale-[0.99] transition-transform"
                  >
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${hasDefects ? "bg-danger" : entry.released ? "bg-success" : "bg-warning"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {entry.supplier}
                        </h3>
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(entry.createdAt).toLocaleDateString("de-DE")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Prüfer: {entry.inspector}
                        {entry.orderNumber && ` · Best.-Nr. ${entry.orderNumber}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {entry.released ? (
                          <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">Freigegeben</span>
                        ) : (
                          <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">Nicht freigegeben</span>
                        )}
                        {hasDefects && (
                          <span className="text-[10px] bg-danger/10 text-danger px-2 py-0.5 rounded-full font-medium">{allDefects.length} Mängel</span>
                        )}
                        {entry.actions.length > 0 && (
                          <span className="text-[10px] bg-magenta/10 text-magenta px-2 py-0.5 rounded-full font-medium">{entry.actions.length} Maßnahmen</span>
                        )}
                      </div>
                      {hasDefects && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {allDefects.slice(0, 3).map((d) => (
                            <span key={d} className="text-[10px] bg-danger/10 text-danger px-2 py-0.5 rounded-full">
                              {defectLabel(d)}
                            </span>
                          ))}
                          {allDefects.length > 3 && (
                            <span className="text-[10px] text-gray-400">+{allDefects.length - 3} weitere</span>
                          )}
                        </div>
                      )}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 shrink-0 mt-1.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
