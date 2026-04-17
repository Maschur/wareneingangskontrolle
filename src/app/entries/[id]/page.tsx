import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { getInspection } from "@/lib/actions";
import { defectLabel } from "@/lib/constants";
import DeleteButton from "./DeleteButton";

export default async function InspectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getInspection(id);
  if (!entry) notFound();

  const allDefects = [
    ...entry.quantityDefects,
    ...entry.identityDefects,
    ...entry.qualityDefects,
    ...entry.documentDefects,
  ];
  const hasDefects = allDefects.length > 0;

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Prüfungsdetail" back="/entries" />

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${hasDefects ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
              <span className={`w-2 h-2 rounded-full ${hasDefects ? "bg-danger" : "bg-success"}`} />
              {hasDefects ? "Mängel festgestellt" : "Mängelfrei"}
            </span>
            {entry.released ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">Freigegeben</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning">Nicht freigegeben</span>
            )}
            <span className="text-xs text-gray-400">
              {new Date(entry.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {/* Step 1: Allgemeine Daten */}
          <Section title="1. Allgemeine Daten">
            <DetailRow label="Prüfdatum" value={entry.inspectionDate} />
            <DetailRow label="Lieferant" value={entry.supplier} />
            <DetailRow label="Bestellnummer" value={entry.orderNumber || "–"} />
            <DetailRow label="Lieferscheinnr." value={entry.deliveryNoteNumber || "–"} />
            <DetailRow label="Prüfer" value={entry.inspector} />
          </Section>

          {/* Step 2: Mengenprüfung */}
          <Section title="2. Mengenprüfung">
            <DetailRow label="Mengen korrekt" value={entry.quantityCorrect ? "Ja" : "Nein"} highlight={entry.quantityCorrect ? "success" : "danger"} />
            {!entry.quantityCorrect && entry.quantityDeviation && (
              <DetailRow label="Abweichung" value={entry.quantityDeviation} />
            )}
            <DefectBadges defects={entry.quantityDefects} />
          </Section>

          {/* Step 3: Identitätsprüfung */}
          <Section title="3. Identitätsprüfung">
            <DetailRow label="Richtiger Artikel" value={entry.correctArticle ? "Ja" : "Nein"} highlight={entry.correctArticle ? "success" : "danger"} />
            <DetailRow label="Artikelnr. korrekt" value={entry.articleNumberCorrect ? "Ja" : "Nein"} highlight={entry.articleNumberCorrect ? "success" : "danger"} />
            <DefectBadges defects={entry.identityDefects} />
          </Section>

          {/* Step 4: Qualitäts- & Sichtprüfung */}
          <Section title="4. Qualitäts- & Sichtprüfung">
            <DetailRow label="Verpackung OK" value={entry.packagingOk ? "Ja" : "Nein"} highlight={entry.packagingOk ? "success" : "danger"} />
            <DetailRow label="Ware OK" value={entry.productOk ? "Ja" : "Nein"} highlight={entry.productOk ? "success" : "danger"} />
            <DetailRow label="Qualität OK" value={entry.qualityOk ? "Ja" : "Nein"} highlight={entry.qualityOk ? "success" : "danger"} />
            <DefectBadges defects={entry.qualityDefects} />
          </Section>

          {/* Step 5: Dokumentenprüfung */}
          <Section title="5. Dokumentenprüfung">
            <DetailRow label="Lieferschein vorhanden" value={entry.deliveryNotePresent ? "Ja" : "Nein"} highlight={entry.deliveryNotePresent ? "success" : "danger"} />
            <DetailRow label="Daten stimmen" value={entry.dataMatchesOrder ? "Ja" : "Nein"} highlight={entry.dataMatchesOrder ? "success" : "danger"} />
            <DefectBadges defects={entry.documentDefects} />
          </Section>

          {/* Step 6: Maßnahmen */}
          {entry.actions.length > 0 && (
            <Section title="6. Maßnahmen">
              <div className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {entry.actions.map((a) => (
                    <span key={a} className="text-xs bg-magenta/10 text-magenta px-3 py-1.5 rounded-lg font-medium">{defectLabel(a)}</span>
                  ))}
                </div>
              </div>
              {entry.actionDescription && (
                <DetailRow label="Beschreibung" value={entry.actionDescription} />
              )}
              {entry.actions.includes("REKLAMATION") && (
                <div className="px-4 py-2">
                  {entry.complaintSent ? (
                    <span className="text-xs text-success font-medium">✓ Reklamation gesendet</span>
                  ) : (
                    <Link href={`/complaint/${entry.id}`} className="inline-block text-xs bg-magenta text-white px-4 py-2 rounded-lg font-semibold">
                      Reklamation erstellen →
                    </Link>
                  )}
                </div>
              )}
            </Section>
          )}

          {/* Step 7: Abschluss */}
          <Section title="7. Abschluss">
            <DetailRow label="Freigegeben" value={entry.released ? "Ja" : "Nein"} highlight={entry.released ? "success" : "warning"} />
            {entry.storedAt && <DetailRow label="Eingelagert am" value={entry.storedAt} />}
            {entry.signatureInspector && <DetailRow label="Unterschrift" value={entry.signatureInspector} />}
          </Section>

          {/* Notes */}
          {entry.notes && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Bemerkungen</h3>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">{entry.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Link href={`/entries/${entry.id}/print`} className="flex-1 py-3 rounded-xl bg-magenta text-white text-sm font-semibold text-center">
              PDF / Drucken
            </Link>
            <DeleteButton id={entry.id} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-gray-600 mb-1 px-1">{title}</h3>
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: "success" | "danger" | "warning" }) {
  const colorClass = highlight === "success" ? "text-success" : highlight === "danger" ? "text-danger" : highlight === "warning" ? "text-warning" : "text-gray-800";
  return (
    <div className="flex justify-between items-center gap-4 px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${colorClass}`}>{value}</span>
    </div>
  );
}

function DefectBadges({ defects }: { defects: string[] }) {
  if (defects.length === 0) return null;
  return (
    <div className="px-4 py-2">
      <div className="flex flex-wrap gap-1">
        {defects.map((d) => (
          <span key={d} className="text-xs bg-danger/10 text-danger px-3 py-1.5 rounded-lg font-medium">{defectLabel(d)}</span>
        ))}
      </div>
    </div>
  );
}
