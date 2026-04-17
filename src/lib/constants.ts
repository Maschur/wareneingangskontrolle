import type { UserProfile } from "@/types";

// ── Benutzerprofil ──
export const USER_PROFILE: UserProfile = {
  username: "jolu",
  company: "Deutsche Telekom",
  personnelNumber: "T-2026-0417",
  email: "testjjn@telekom.de",
};

// ── Standard-Lieferanten (werden beim Seed in die DB geschrieben) ──
export const DEFAULT_SUPPLIERS = [
  "Linuk GmbH",
  "Brauer KG",
  "Beamer Lechner GmbH",
  "Telaris Systemtechnik",
  "Optikon Handels AG",
  "NetWare Solutions",
] as const;

// ── Mengenprüfung Mängel (Step 2) ──
export const QUANTITY_DEFECTS = [
  { key: "FEHLMENGE", label: "Fehlmenge" },
  { key: "UEBERMENGE", label: "Übermenge" },
  { key: "TEILLIEFERUNG", label: "Teillieferung" },
] as const;

// ── Identitätsprüfung Mängel (Step 3) ──
export const IDENTITY_DEFECTS = [
  { key: "FALSCHER_ARTIKEL", label: "Falscher Artikel" },
  { key: "FALSCHE_VARIANTE", label: "Falsche Variante (Größe/Farbe/Sonstige)" },
] as const;

// ── Qualitätsprüfung Mängel (Step 4) ──
export const QUALITY_DEFECTS = [
  { key: "TRANSPORTSCHADEN", label: "Transportschaden" },
  { key: "VERPACKUNG_BESCHAEDIGT", label: "Verpackung beschädigt" },
  { key: "WARE_DEFEKT", label: "Ware defekt" },
  { key: "VERSCHMUTZT", label: "Verschmutzt" },
  { key: "ABGELAUFEN", label: "Abgelaufen (bei Lebensmitteln)" },
] as const;

// ── Dokumentenprüfung Mängel (Step 5) ──
export const DOCUMENT_DEFECTS = [
  { key: "LIEFERSCHEIN_FEHLT", label: "Lieferschein fehlt" },
  { key: "FALSCHE_ANGABEN", label: "Falsche Angaben" },
] as const;

// ── Maßnahmen (Step 6) ──
export const ACTION_TYPES = [
  { key: "REKLAMATION", label: "Reklamation" },
  { key: "WARE_ZURUECK", label: "Ware zurückgesendet" },
  { key: "PREISNACHLASS", label: "Preisnachlass" },
  { key: "INTERNE_MELDUNG", label: "Interne Meldung" },
] as const;

// ── Alle Defect-Labels zusammenführen ──
const ALL_DEFECTS = [
  ...QUANTITY_DEFECTS,
  ...IDENTITY_DEFECTS,
  ...QUALITY_DEFECTS,
  ...DOCUMENT_DEFECTS,
  ...ACTION_TYPES,
];

export function defectLabel(key: string): string {
  return ALL_DEFECTS.find((d) => d.key === key)?.label ?? key;
}
