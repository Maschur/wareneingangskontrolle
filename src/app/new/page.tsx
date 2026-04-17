"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BarcodeScanner from "@/components/BarcodeScanner";
import { createInspection } from "@/lib/actions";
import { getSuppliers, getArticles } from "@/lib/actions";
import { QUANTITY_DEFECTS, IDENTITY_DEFECTS, QUALITY_DEFECTS, DOCUMENT_DEFECTS, ACTION_TYPES } from "@/lib/constants";
import type { InspectionInput } from "@/types";

const TOTAL_STEPS = 7;

const STEP_TITLES = [
  "Allgemeine Daten",
  "Mengenprüfung",
  "Identitätsprüfung",
  "Qualitäts- & Sichtprüfung",
  "Dokumentenprüfung",
  "Maßnahmen bei Mängeln",
  "Abschluss",
];

const initialState: InspectionInput = {
  inspectionDate: new Date().toISOString().slice(0, 10),
  supplier: "",
  articleName: "",
  orderNumber: "",
  deliveryNoteNumber: "",
  inspector: "",
  quantityCorrect: true,
  quantityDeviation: "",
  quantityDefects: [],
  correctArticle: true,
  articleNumberCorrect: true,
  identityDefects: [],
  identityNotes: "",
  packagingOk: true,
  productOk: true,
  qualityOk: true,
  qualityDefects: [],
  qualityNotes: "",
  deliveryNotePresent: true,
  dataMatchesOrder: true,
  documentDefects: [],
  actions: [],
  actionDescription: "",
  released: false,
  storedAt: "",
  signatureInspector: "",
};

export default function NewInspectionPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<InspectionInput>(initialState);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [articles, setArticles] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState<"order" | "delivery" | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
    getArticles().then(setArticles);
  }, []);

  function update(partial: Partial<InspectionInput>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function toggleDefect(field: "quantityDefects" | "identityDefects" | "qualityDefects" | "documentDefects" | "actions", key: string) {
    setData((prev) => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(key) ? arr.filter((d) => d !== key) : [...arr, key] };
    });
  }

  const hasAnyDefects = data.quantityDefects.length > 0 || data.identityDefects.length > 0 || data.qualityDefects.length > 0 || data.documentDefects.length > 0;

  function canAdvance(): boolean {
    switch (step) {
      case 1: return data.supplier.length > 0 && data.inspector.length > 0 && data.articleName.length > 0;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      case 7: return data.signatureInspector.length > 0;
      default: return false;
    }
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      const id = await createInspection(data);
      window.location.href = `/entries/${id}`;
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Neue Prüfung" back="/" />

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-magenta" : "bg-gray-200"}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400">Schritt {step} von {TOTAL_STEPS} – {STEP_TITLES[step - 1]}</p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">

          {/* ── Step 1: Allgemeine Daten ── */}
          {step === 1 && (
            <StepContainer title="Allgemeine Daten" subtitle="Grundinformationen zur Lieferung">
              <Field label="Datum">
                <input type="date" value={data.inspectionDate} onChange={(e) => update({ inspectionDate: e.target.value })} className="input" />
              </Field>

              <Field label="Lieferant *">
                <div className="grid grid-cols-2 gap-2">
                  {suppliers.map((s) => (
                    <SelectButton key={s} label={s} selected={data.supplier === s} onClick={() => update({ supplier: s })} />
                  ))}
                </div>
                {!suppliers.includes(data.supplier) && data.supplier !== "" && (
                  <input type="text" value={data.supplier} onChange={(e) => update({ supplier: e.target.value })} className="input mt-2" placeholder="Lieferant eingeben…" autoFocus />
                )}
                {suppliers.length > 0 && (
                  <button type="button" onClick={() => update({ supplier: data.supplier === "__other" ? "" : "__other" })} className={`mt-2 text-xs font-medium ${data.supplier && !suppliers.includes(data.supplier) ? "text-magenta" : "text-gray-400"}`}>
                    Anderer Lieferant…
                  </button>
                )}
              </Field>

              <Field label="Artikel / Ware *">
                <div className="grid grid-cols-2 gap-2">
                  {articles.map((a) => (
                    <SelectButton key={a} label={a} selected={data.articleName === a} onClick={() => update({ articleName: a })} />
                  ))}
                </div>
                {!articles.includes(data.articleName) && data.articleName !== "" && (
                  <input type="text" value={data.articleName} onChange={(e) => update({ articleName: e.target.value })} className="input mt-2" placeholder="Artikel eingeben…" autoFocus />
                )}
                <button type="button" onClick={() => update({ articleName: data.articleName === "__other" ? "" : "__other" })} className={`mt-2 text-xs font-medium ${data.articleName && !articles.includes(data.articleName) ? "text-magenta" : "text-gray-400"}`}>
                  Anderer Artikel…
                </button>
              </Field>

              <Field label="Bestellnummer">
                <div className="flex gap-2">
                  <input type="text" value={data.orderNumber} onChange={(e) => update({ orderNumber: e.target.value })} className="input flex-1" placeholder="Bestellnr. eintippen" />
                  <button type="button" onClick={() => setShowScanner("order")} className="px-4 py-3 bg-magenta text-white rounded-xl text-sm font-medium shrink-0">Scan</button>
                </div>
              </Field>

              <Field label="Lieferscheinnummer">
                <div className="flex gap-2">
                  <input type="text" value={data.deliveryNoteNumber} onChange={(e) => update({ deliveryNoteNumber: e.target.value })} className="input flex-1" placeholder="Lieferscheinnr. eintippen" />
                  <button type="button" onClick={() => setShowScanner("delivery")} className="px-4 py-3 bg-magenta text-white rounded-xl text-sm font-medium shrink-0">Scan</button>
                </div>
              </Field>

              <Field label="Prüfer *">
                <input type="text" value={data.inspector} onChange={(e) => update({ inspector: e.target.value })} className="input" placeholder="Name des Prüfers" />
              </Field>
            </StepContainer>
          )}

          {/* ── Step 2: Mengenprüfung ── */}
          {step === 2 && (
            <StepContainer title="Mengenprüfung" subtitle="Wurden die bestellten Mengen korrekt geliefert?">
              <InfoBox>Wird oft durch Zählen, Wiegen oder Messen geprüft.</InfoBox>

              <Field label="Stimmen die Mengen?">
                <YesNo value={data.quantityCorrect} onChange={(v) => update({ quantityCorrect: v })} />
              </Field>

              {!data.quantityCorrect && (
                <>
                  <Field label="Abweichung beschreiben">
                    <textarea value={data.quantityDeviation} onChange={(e) => update({ quantityDeviation: e.target.value })} className="input resize-none" rows={2} placeholder="z. B. 5 Stück fehlen" />
                  </Field>

                  <Field label="Typische Mängel">
                    <DefectList items={QUANTITY_DEFECTS} selected={data.quantityDefects} onToggle={(k) => toggleDefect("quantityDefects", k)} />
                  </Field>
                </>
              )}
            </StepContainer>
          )}

          {/* ── Step 3: Identitätsprüfung ── */}
          {step === 3 && (
            <StepContainer title="Identitätsprüfung" subtitle="Wurde der richtige Artikel in der richtigen Variante geliefert?">
              <Field label="Richtiger Artikel geliefert?">
                <YesNo value={data.correctArticle} onChange={(v) => update({ correctArticle: v })} />
              </Field>

              <Field label="Artikelnummer korrekt?">
                <YesNo value={data.articleNumberCorrect} onChange={(v) => update({ articleNumberCorrect: v })} />
              </Field>

              {(!data.correctArticle || !data.articleNumberCorrect) && (
                <>
                  <Field label="Mängel">
                    <DefectList items={IDENTITY_DEFECTS} selected={data.identityDefects} onToggle={(k) => toggleDefect("identityDefects", k)} />
                  </Field>
                  <Field label="Bemerkung">
                    <textarea value={data.identityNotes} onChange={(e) => update({ identityNotes: e.target.value })} className="input resize-none" rows={2} placeholder="Details zur Abweichung…" />
                  </Field>
                </>
              )}
            </StepContainer>
          )}

          {/* ── Step 4: Qualitäts- & Sichtprüfung ── */}
          {step === 4 && (
            <StepContainer title="Qualitäts- & Sichtprüfung" subtitle="Optische und qualitative Kontrolle der Ware">
              <Field label="Verpackung unbeschädigt?">
                <YesNo value={data.packagingOk} onChange={(v) => update({ packagingOk: v })} />
              </Field>

              <Field label="Ware in Ordnung?">
                <YesNo value={data.productOk} onChange={(v) => update({ productOk: v })} />
              </Field>

              <Field label="Qualität wie bestellt?">
                <YesNo value={data.qualityOk} onChange={(v) => update({ qualityOk: v })} />
              </Field>

              {(!data.packagingOk || !data.productOk || !data.qualityOk) && (
                <>
                  <Field label="Typische Mängel">
                    <DefectList items={QUALITY_DEFECTS} selected={data.qualityDefects} onToggle={(k) => toggleDefect("qualityDefects", k)} />
                  </Field>

                  <InfoBox variant="warning">Schäden wie eingedrückte Kartons oder Nässe müssen dokumentiert werden.</InfoBox>

                  <Field label="Bemerkung">
                    <textarea value={data.qualityNotes} onChange={(e) => update({ qualityNotes: e.target.value })} className="input resize-none" rows={2} placeholder="Details zu Qualitätsmängeln…" />
                  </Field>
                </>
              )}
            </StepContainer>
          )}

          {/* ── Step 5: Dokumentenprüfung ── */}
          {step === 5 && (
            <StepContainer title="Dokumentenprüfung" subtitle="Prüfung der Begleitdokumente">
              <Field label="Lieferschein vorhanden?">
                <YesNo value={data.deliveryNotePresent} onChange={(v) => update({ deliveryNotePresent: v })} />
              </Field>

              <Field label="Stimmen Daten mit Bestellung überein?">
                <YesNo value={data.dataMatchesOrder} onChange={(v) => update({ dataMatchesOrder: v })} />
              </Field>

              {(!data.deliveryNotePresent || !data.dataMatchesOrder) && (
                <Field label="Mängel">
                  <DefectList items={DOCUMENT_DEFECTS} selected={data.documentDefects} onToggle={(k) => toggleDefect("documentDefects", k)} />
                </Field>
              )}
            </StepContainer>
          )}

          {/* ── Step 6: Maßnahmen bei Mängeln ── */}
          {step === 6 && (
            <StepContainer title="Maßnahmen bei Mängeln" subtitle="Welche Maßnahmen werden ergriffen?">
              {!hasAnyDefects ? (
                <InfoBox>Keine Mängel festgestellt – keine Maßnahmen erforderlich.</InfoBox>
              ) : (
                <>
                  <InfoBox variant="warning">Wichtig: Mängel müssen sofort gemeldet werden, sonst verliert man Ansprüche (§ 377 HGB).</InfoBox>

                  <Field label="Maßnahmen">
                    {ACTION_TYPES.map(({ key, label }) => (
                      <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors mb-2 ${data.actions.includes(key) ? "border-magenta bg-magenta/5" : "border-gray-200 bg-white"}`}>
                        <input type="checkbox" checked={data.actions.includes(key)} onChange={() => toggleDefect("actions", key)} className="accent-magenta w-5 h-5 shrink-0" />
                        <span className="text-sm text-gray-800">{label}</span>
                      </label>
                    ))}
                  </Field>

                  {data.actions.includes("REKLAMATION") && (
                    <div className="bg-magenta/5 border border-magenta/20 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-magenta mb-2">Reklamation vorbereiten</p>
                      <p className="text-xs text-gray-600 mb-3">Nach dem Speichern können Sie eine vorausgefüllte Reklamations-E-Mail generieren.</p>
                    </div>
                  )}

                  <Field label="Beschreibung der Maßnahmen">
                    <textarea value={data.actionDescription} onChange={(e) => update({ actionDescription: e.target.value })} className="input resize-none" rows={3} placeholder="Detaillierte Beschreibung…" />
                  </Field>
                </>
              )}
            </StepContainer>
          )}

          {/* ── Step 7: Abschluss ── */}
          {step === 7 && (
            <StepContainer title="Abschluss" subtitle="Prüfung abschließen und freigeben">
              <Field label="Ware freigegeben?">
                <YesNo value={data.released} onChange={(v) => update({ released: v })} />
              </Field>

              <Field label="Eingelagert am">
                <input type="date" value={data.storedAt} onChange={(e) => update({ storedAt: e.target.value })} className="input" />
              </Field>

              <Field label="Unterschrift / Prüfer *">
                <input type="text" value={data.signatureInspector} onChange={(e) => update({ signatureInspector: e.target.value })} className="input" placeholder="Name zur Bestätigung" />
              </Field>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Zusammenfassung</h3>
                <SummaryRow label="Datum" value={data.inspectionDate} />
                <SummaryRow label="Lieferant" value={data.supplier} />
                <SummaryRow label="Artikel" value={data.articleName || "–"} />
                <SummaryRow label="Bestellnr." value={data.orderNumber || "–"} />
                <SummaryRow label="Lieferscheinnr." value={data.deliveryNoteNumber || "–"} />
                <SummaryRow label="Prüfer" value={data.inspector} />
                <div className="border-t border-gray-200 my-2" />
                <SummaryRow label="Mengen korrekt" value={data.quantityCorrect ? "✓ Ja" : "✗ Nein"} />
                <SummaryRow label="Richtiger Artikel" value={data.correctArticle ? "✓ Ja" : "✗ Nein"} />
                <SummaryRow label="Qualität OK" value={data.packagingOk && data.productOk && data.qualityOk ? "✓ Ja" : "✗ Nein"} />
                <SummaryRow label="Dokumente OK" value={data.deliveryNotePresent && data.dataMatchesOrder ? "✓ Ja" : "✗ Nein"} />
                <SummaryRow label="Mängel" value={hasAnyDefects ? `${data.quantityDefects.length + data.identityDefects.length + data.qualityDefects.length + data.documentDefects.length} festgestellt` : "Keine"} />
                <SummaryRow label="Maßnahmen" value={data.actions.length > 0 ? `${data.actions.length} geplant` : "Keine"} />
                <div className="border-t border-gray-200 my-2" />
                <SummaryRow label="Freigegeben" value={data.released ? "✓ Ja" : "✗ Nein"} />
              </div>
            </StepContainer>
          )}
        </div>
      </main>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600">Zurück</button>
          )}
          {step < TOTAL_STEPS ? (
            <button type="button" onClick={() => canAdvance() && setStep(step + 1)} disabled={!canAdvance()} className="flex-1 py-3 rounded-xl bg-magenta text-white text-sm font-semibold disabled:opacity-40 transition-opacity">Weiter</button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={!canAdvance() || saving} className="flex-1 py-3 rounded-xl bg-magenta text-white text-sm font-semibold disabled:opacity-40 transition-opacity">
              {saving ? "Speichern…" : "Prüfung speichern"}
            </button>
          )}
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={(code) => {
            if (showScanner === "order") update({ orderNumber: code });
            else update({ deliveryNoteNumber: code });
            setShowScanner(null);
          }}
          onClose={() => setShowScanner(null)}
        />
      )}
    </div>
  );
}

// ── Sub-Components ──

function StepContainer({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-5">{subtitle}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function YesNo({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      <SelectButton label="✓ Ja" selected={value} onClick={() => onChange(true)} />
      <SelectButton label="✗ Nein" selected={!value} onClick={() => onChange(false)} />
    </div>
  );
}

function SelectButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`px-4 py-3 rounded-xl border font-medium transition-colors text-sm text-left flex-1 ${selected ? "border-magenta bg-magenta/10 text-magenta" : "border-gray-200 bg-white text-gray-700"}`}>
      {label}
    </button>
  );
}

function DefectList({ items, selected, onToggle }: { items: readonly { key: string; label: string }[]; selected: string[]; onToggle: (key: string) => void }) {
  return (
    <div className="space-y-2">
      {items.map(({ key, label }) => (
        <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selected.includes(key) ? "border-magenta bg-magenta/5" : "border-gray-200 bg-white"}`}>
          <input type="checkbox" checked={selected.includes(key)} onChange={() => onToggle(key)} className="accent-magenta w-5 h-5 shrink-0" />
          <span className="text-sm text-gray-800">{label}</span>
        </label>
      ))}
    </div>
  );
}

function InfoBox({ children, variant = "info" }: { children: React.ReactNode; variant?: "info" | "warning" }) {
  const cls = variant === "warning" ? "bg-warning/10 border-warning/20 text-warning" : "bg-magenta/5 border-magenta/10 text-gray-600";
  return <div className={`border rounded-xl p-3 mb-4 text-sm ${cls}`}>{children}</div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}
