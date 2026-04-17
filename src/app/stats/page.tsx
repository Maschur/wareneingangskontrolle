import Link from "next/link";
import Header from "@/components/Header";
import { getStats } from "@/lib/actions";
import { defectLabel } from "@/lib/constants";

const PERIODS = [
  { label: "7 Tage", value: "7" },
  { label: "30 Tage", value: "30" },
  { label: "90 Tage", value: "90" },
  { label: "1 Jahr", value: "365" },
  { label: "Gesamt", value: "" },
] as const;

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysParam } = await searchParams;
  const days = daysParam ? parseInt(daysParam) : undefined;
  const stats = await getStats(days);

  const maxDefect = Math.max(...Object.values(stats.defectCounts), 1);
  const maxSupplier = Math.max(...Object.values(stats.bySupplier).map((s) => s.total), 1);

  // Pattern analysis
  const patterns: string[] = [];
  if (stats.defectRate > 20) patterns.push("Hohe Mängelquote! Über 20 % der Prüfungen weisen Mängel auf.");
  const worstSupplier = Object.entries(stats.bySupplier).sort((a, b) => {
    const rateA = a[1].total > 0 ? a[1].withDefects / a[1].total : 0;
    const rateB = b[1].total > 0 ? b[1].withDefects / b[1].total : 0;
    return rateB - rateA;
  })[0];
  if (worstSupplier && worstSupplier[1].withDefects > 0) {
    const rate = Math.round((worstSupplier[1].withDefects / worstSupplier[1].total) * 100);
    patterns.push(`${worstSupplier[0]} hat die höchste Mängelrate: ${rate} % (${worstSupplier[1].withDefects} von ${worstSupplier[1].total}).`);
  }
  const topDefect = Object.entries(stats.defectCounts).sort((a, b) => b[1] - a[1])[0];
  if (topDefect && topDefect[1] > 2) {
    patterns.push(`Häufigster Mangel: „${defectLabel(topDefect[0])}" mit ${topDefect[1]} Vorfällen.`);
  }
  if (stats.actionCounts["REKLAMATION"] > 0) {
    patterns.push(`${stats.actionCounts["REKLAMATION"]} Reklamation(en) eingeleitet.`);
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Statistik" back="/" />

      <main className="flex-1 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Period Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {PERIODS.map((p) => (
              <Link
                key={p.value}
                href={p.value ? `/stats?days=${p.value}` : "/stats"}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  (daysParam || "") === p.value ? "bg-magenta text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <KpiCard label="Prüfungen" value={stats.totalInspections} />
            <KpiCard label="Freigegeben" value={stats.totalReleased} color="success" />
            <KpiCard label="Mit Mängeln" value={stats.totalWithDefects} color={stats.totalWithDefects > 0 ? "danger" : "success"} />
            <KpiCard
              label="Mängelquote"
              value={`${stats.defectRate.toFixed(1)}%`}
              color={stats.defectRate > 20 ? "danger" : stats.defectRate > 0 ? "warning" : "success"}
            />
          </div>

          {/* Pattern Analysis */}
          {patterns.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Muster & Auffälligkeiten</h2>
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
                {patterns.map((p, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-magenta shrink-0">•</span>
                    <span className="text-gray-700">{p}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* By Supplier */}
          {Object.keys(stats.bySupplier).length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Nach Lieferant</h2>
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                {Object.entries(stats.bySupplier)
                  .sort((a, b) => b[1].withDefects - a[1].withDefects)
                  .map(([name, data]) => (
                    <BarRow key={name} label={name} total={data.total} defective={data.withDefects} max={maxSupplier} />
                  ))}
              </div>
            </section>
          )}

          {/* Action Counts */}
          {Object.keys(stats.actionCounts).length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Ergriffene Maßnahmen</h2>
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
                {Object.entries(stats.actionCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, count]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-700">{defectLabel(key)}</span>
                      <span className="text-gray-500 font-medium">{count}×</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Defect Types */}
          {Object.keys(stats.defectCounts).length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Häufigste Mängel</h2>
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                {Object.entries(stats.defectCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, count]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700">{defectLabel(key)}</span>
                        <span className="text-gray-500 font-medium">{count}×</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-magenta rounded-full transition-all" style={{ width: `${(count / maxDefect) * 100}%` }} />
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Recent Inspections */}
          {stats.recentInspections.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Letzte Prüfungen</h2>
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                {stats.recentInspections.map((r) => (
                  <Link key={r.id} href={`/entries/${r.id}`} className="flex justify-between items-center px-4 py-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-800">{r.supplier}</span>
                      <span className="text-gray-400 ml-2">{new Date(r.createdAt).toLocaleDateString("de-DE")}</span>
                    </div>
                    {r.released ? (
                      <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">OK</span>
                    ) : (
                      <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">Offen</span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {stats.totalInspections === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Noch keine Daten für den gewählten Zeitraum</p>
              <Link href="/new" className="inline-block bg-magenta text-white px-6 py-3 rounded-xl text-sm font-semibold">
                Erste Prüfung starten
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function KpiCard({ label, value, color }: { label: string; value: number | string; color?: "danger" | "warning" | "success" }) {
  const valueColor = color === "danger" ? "text-danger" : color === "warning" ? "text-warning" : color === "success" ? "text-success" : "text-gray-800";
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

function BarRow({ label, total, defective, max }: { label: string; total: number; defective: number; max: number }) {
  const okPct = ((total - defective) / max) * 100;
  const defPct = (defective / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-500">
          {total} Prüf. · {defective > 0 ? <span className="text-danger">{defective} mit Mängeln</span> : "0 Mängel"}
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
        <div className="h-full bg-success rounded-l-full" style={{ width: `${okPct}%` }} />
        {defective > 0 && <div className="h-full bg-danger" style={{ width: `${defPct}%` }} />}
      </div>
    </div>
  );
}
