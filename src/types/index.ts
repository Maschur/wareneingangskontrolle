export interface InspectionInput {
  // Step 1: Allgemeine Daten
  inspectionDate: string;
  supplier: string;
  orderNumber: string;
  deliveryNoteNumber: string;
  inspector: string;

  // Step 2: Mengenprüfung
  quantityCorrect: boolean;
  quantityDeviation: string;
  quantityDefects: string[];

  // Step 3: Identitätsprüfung
  correctArticle: boolean;
  articleNumberCorrect: boolean;
  identityDefects: string[];
  identityNotes: string;

  // Step 4: Qualitäts- & Sichtprüfung
  packagingOk: boolean;
  productOk: boolean;
  qualityOk: boolean;
  qualityDefects: string[];
  qualityNotes: string;

  // Step 5: Dokumentenprüfung
  deliveryNotePresent: boolean;
  dataMatchesOrder: boolean;
  documentDefects: string[];

  // Step 6: Maßnahmen bei Mängeln
  actions: string[];
  actionDescription: string;

  // Step 7: Abschluss
  released: boolean;
  storedAt: string;
  signatureInspector: string;
}

export interface InspectionRecord extends InspectionInput {
  id: string;
  createdAt: Date;
  complaintSent: boolean;
  notes: string | null;
}

export interface UserProfile {
  username: string;
  company: string;
  personnelNumber: string;
  email: string;
}
