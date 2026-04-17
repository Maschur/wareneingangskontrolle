"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import { getInspection, markComplaintSent, getSuppliersWithIds } from "@/lib/actions";
import { generateComplaintEmail } from "@/lib/email-templates";
import { defectLabel } from "@/lib/constants";
import { useParams } from "next/navigation";

type Entry = NonNullable<Awaited<ReturnType<typeof getInspection>>>;

export default function ComplaintPage() {
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<Entry | null>(null);
  const [supplierEmail, setSupplierEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const load = useCallback(async () => {
    const data = await getInspection(id);
    if (data) {
      setEntry(data);
      // Try to find supplier email
      const suppliers = await getSuppliersWithIds();
      const match = suppliers.find((s) => s.name === data.supplier);
      if (match && "email" in match && match.email) {
        setSupplierEmail(match.email as string);
      }
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!entry) {
    return (
      <div className="flex flex-col min-h-full">
        <Header title="Reklamation" back={`/entries/${id}`} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Lade…</p>
        </div>
      </div>
    );
  }

  const allDefects = [
    ...entry.quantityDefects,
    ...entry.identityDefects,
    ...entry.qualityDefects,
    ...entry.documentDefects,
  ];

  const email = generateComplaintEmail({
    supplier: entry.supplier,
    supplierEmail,
    orderNumber: entry.orderNumber,
    deliveryNoteNumber: entry.deliveryNoteNumber,
    inspectionDate: entry.inspectionDate,
    defects: allDefects.map(defectLabel),
    description: entry.actionDescription || "",
  });

  async function handleCopy() {
    await navigator.clipboard.writeText(`Betreff: ${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleMarkSent() {
    await markComplaintSent(id);
    setSent(true);
  }

  function handleMailto() {
    const mailto = `mailto:${encodeURIComponent(email.to)}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
    window.open(mailto, "_blank");
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Reklamation" back={`/entries/${id}`} />

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Reklamation erstellen</h2>
          <p className="text-sm text-gray-500 mb-5">
            Vorgefertigte E-Mail für Lieferant <strong>{entry.supplier}</strong>
          </p>

          {/* E-Mail Empfänger */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Empfänger E-Mail</label>
            <input
              type="email"
              value={supplierEmail}
              onChange={(e) => setSupplierEmail(e.target.value)}
              placeholder="lieferant@example.com"
              className="input"
            />
            {!supplierEmail && (
              <p className="text-xs text-warning mt-1">
                Tipp: E-Mail-Adresse in den Einstellungen beim Lieferanten hinterlegen.
              </p>
            )}
          </div>

          {/* E-Mail Vorschau */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <p className="text-xs text-gray-500">An: {email.to || "(kein Empfänger)"}</p>
              <p className="text-xs text-gray-500">Betreff: {email.subject}</p>
            </div>
            <div className="px-4 py-3">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{email.body}</pre>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button onClick={handleCopy} className="w-full py-3 rounded-xl bg-magenta text-white text-sm font-semibold">
              {copied ? "✓ Kopiert!" : "E-Mail Text kopieren"}
            </button>

            {supplierEmail && (
              <button onClick={handleMailto} className="w-full py-3 rounded-xl border border-magenta text-magenta text-sm font-semibold">
                In E-Mail-Programm öffnen
              </button>
            )}

            {!sent && !entry.complaintSent ? (
              <button onClick={handleMarkSent} className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">
                Als gesendet markieren
              </button>
            ) : (
              <p className="text-center text-sm text-success font-medium">✓ Reklamation als gesendet markiert</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
