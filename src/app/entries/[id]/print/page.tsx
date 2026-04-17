import { notFound } from "next/navigation";
import { getInspection } from "@/lib/actions";
import { defectLabel } from "@/lib/constants";
import PrintActions from "./PrintActions";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getInspection(id);
  if (!entry) notFound();

  const date = new Date(entry.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const allDefects = [...entry.quantityDefects, ...entry.identityDefects, ...entry.qualityDefects, ...entry.documentDefects];

  return (
    <div className="min-h-full bg-white">
      <PrintActions id={entry.id} />

      <div className="max-w-2xl mx-auto px-6 py-8 print:px-0 print:py-0">
        {/* Header */}
        <div className="border-b-2 border-magenta pb-4 mb-6 print:border-black">
          <h1 className="text-xl font-bold text-gray-800">Wareneingangskontrolle – Prüfbericht</h1>
          <p className="text-sm text-gray-500 mt-1">Erstellt am {date}</p>
        </div>

        {/* Step 1: Allgemeine Daten */}
        <h2 className="text-sm font-bold text-gray-800 mb-2">1. Allgemeine Daten</h2>
        <table className="w-full text-sm mb-6">
          <tbody>
            <PrintRow label="Prüfdatum" value={entry.inspectionDate} />
            <PrintRow label="Prüfer" value={entry.inspector} />
            <PrintRow label="Lieferant" value={entry.supplier} />
            <PrintRow label="Bestellnummer" value={entry.orderNumber || "–"} />
            <PrintRow label="Lieferscheinnummer" value={entry.deliveryNoteNumber || "–"} />
          </tbody>
        </table>

        {/* Step 2: Mengenprüfung */}
        <h2 className="text-sm font-bold text-gray-800 mb-2">2. Mengenprüfung</h2>
        <table className="w-full text-sm mb-6">
          <tbody>
            <PrintRow label="Mengen korrekt" value={entry.quantityCorrect ? "Ja" : "Nein"} />
            {!entry.quantityCorrect && entry.quantityDeviation && <PrintRow label="Abweichung" value={entry.quantityDeviation} />}
          </tbody>
        </table>
        {entry.quantityDefects.length > 0 && <PrintDefects defects={entry.quantityDefects} />}

        {/* Step 3: Identitätsprüfung */}
        <h2 className="text-sm font-bold text-gray-800 mb-2">3. Identitätsprüfung</h2>
        <table className="w-full text-sm mb-6">
          <tbody>
            <PrintRow label="Richtiger Artikel" value={entry.correctArticle ? "Ja" : "Nein"} />
            <PrintRow label="Artikelnr. korrekt" value={entry.articleNumberCorrect ? "Ja" : "Nein"} />
          </tbody>
        </table>
        {entry.identityDefects.length > 0 && <PrintDefects defects={entry.identityDefects} />}

        {/* Step 4: Qualitäts- & Sichtprüfung */}
        <h2 className="text-sm font-bold text-gray-800 mb-2">4. Qualitäts- & Sichtprüfung</h2>
        <table className="w-full text-sm mb-6">
          <tbody>
            <PrintRow label="Verpackung OK" value={entry.packagingOk ? "Ja" : "Nein"} />
            <PrintRow label="Ware OK" value={entry.productOk ? "Ja" : "Nein"} />
            <PrintRow label="Qualität OK" value={entry.qualityOk ? "Ja" : "Nein"} />
          </tbody>
        </table>
        {entry.qualityDefects.length > 0 && <PrintDefects defects={entry.qualityDefects} />}

        {/* Step 5: Dokumentenprüfung */}
        <h2 className="text-sm font-bold text-gray-800 mb-2">5. Dokumentenprüfung</h2>
        <table className="w-full text-sm mb-6">
          <tbody>
            <PrintRow label="Lieferschein vorhanden" value={entry.deliveryNotePresent ? "Ja" : "Nein"} />
            <PrintRow label="Daten stimmen" value={entry.dataMatchesOrder ? "Ja" : "Nein"} />
          </tbody>
        </table>
        {entry.documentDefects.length > 0 && <PrintDefects defects={entry.documentDefects} />}

        {/* Step 6: Maßnahmen */}
        {entry.actions.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-gray-800 mb-2">6. Maßnahmen bei Mängeln</h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-2">
              {entry.actions.map((a) => <li key={a}>{defectLabel(a)}</li>)}
            </ul>
            {entry.actionDescription && <p className="text-sm text-gray-700 mb-6">Beschreibung: {entry.actionDescription}</p>}
          </>
        )}

        {/* Step 7: Abschluss */}
        <h2 className="text-sm font-bold text-gray-800 mb-2">7. Abschluss</h2>
        <table className="w-full text-sm mb-6">
          <tbody>
            <PrintRow label="Ware freigegeben" value={entry.released ? "Ja" : "Nein"} />
            {entry.storedAt && <PrintRow label="Eingelagert am" value={entry.storedAt} />}
            {entry.signatureInspector && <PrintRow label="Unterschrift Prüfer" value={entry.signatureInspector} />}
          </tbody>
        </table>

        {/* Gesamtergebnis */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 mb-2">Gesamtergebnis</h2>
          <p className="text-sm text-gray-700">
            {allDefects.length === 0 ? "Keine Mängel festgestellt. Ware mängelfrei." : `${allDefects.length} Mängel festgestellt.`}
            {entry.released ? " Ware wurde freigegeben." : " Ware wurde NICHT freigegeben."}
          </p>
        </div>

        {/* Notes */}
        {entry.notes && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-800 mb-2">Bemerkungen</h2>
            <p className="text-sm text-gray-700">{entry.notes}</p>
          </div>
        )}

        {/* Signature line */}
        <div className="border-t border-gray-300 pt-6 mt-12">
          <div className="flex justify-between gap-8">
            <div className="flex-1">
              <div className="border-b border-gray-400 mb-1 h-8" />
              <p className="text-xs text-gray-500">Datum, Unterschrift Prüfer</p>
            </div>
            <div className="flex-1">
              <div className="border-b border-gray-400 mb-1 h-8" />
              <p className="text-xs text-gray-500">Datum, Unterschrift Verantwortlicher</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-4 text-gray-500 font-medium w-1/3">{label}</td>
      <td className="py-2 text-gray-800">{value}</td>
    </tr>
  );
}

function PrintDefects({ defects }: { defects: string[] }) {
  return (
    <div className="mb-4">
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {defects.map((d) => <li key={d}>{defectLabel(d)}</li>)}
      </ul>
    </div>
  );
}
