import { USER_PROFILE } from "@/lib/constants";

export function generateComplaintEmail(data: {
  supplier: string;
  supplierEmail?: string;
  orderNumber: string;
  deliveryNoteNumber: string;
  inspectionDate: string;
  defects: string[];
  description?: string;
}): { subject: string; body: string; to: string } {
  const defectList = data.defects.map((d) => `  - ${d}`).join("\n");
  const today = new Date().toLocaleDateString("de-DE");

  const subject = `Reklamation – Bestellnr. ${data.orderNumber || "k.A."} / Lieferschein ${data.deliveryNoteNumber || "k.A."}`;

  const body = `Sehr geehrte Damen und Herren,

hiermit reklamieren wir die folgende Lieferung:

Lieferant: ${data.supplier}
Bestellnummer: ${data.orderNumber || "k.A."}
Lieferscheinnummer: ${data.deliveryNoteNumber || "k.A."}
Prüfdatum: ${data.inspectionDate}

Bei der Wareneingangskontrolle wurden folgende Mängel festgestellt:

${defectList}

${data.description ? `Zusätzliche Beschreibung:\n${data.description}\n` : ""}Wir bitten um umgehende Stellungnahme und Klärung der weiteren Vorgehensweise. Bitte teilen Sie uns mit, ob eine Ersatzlieferung, Gutschrift oder Rücksendung erfolgen soll.

Gemäß § 377 HGB haben wir die Mängel unverzüglich nach Eingang der Ware angezeigt.

Fotos der beschädigten Ware sind diesem Schreiben beigefügt.

Mit freundlichen Grüßen

${USER_PROFILE.username}
${USER_PROFILE.company}
Personalnummer: ${USER_PROFILE.personnelNumber}
E-Mail: ${USER_PROFILE.email}
Datum: ${today}`;

  return {
    subject,
    body,
    to: data.supplierEmail || "",
  };
}
