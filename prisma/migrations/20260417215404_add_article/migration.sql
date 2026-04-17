-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspectionDate" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "articleName" TEXT NOT NULL DEFAULT '',
    "orderNumber" TEXT NOT NULL DEFAULT '',
    "deliveryNoteNumber" TEXT NOT NULL DEFAULT '',
    "inspector" TEXT NOT NULL,
    "quantityCorrect" BOOLEAN NOT NULL DEFAULT true,
    "quantityDeviation" TEXT,
    "quantityDefects" TEXT NOT NULL DEFAULT '[]',
    "correctArticle" BOOLEAN NOT NULL DEFAULT true,
    "articleNumberCorrect" BOOLEAN NOT NULL DEFAULT true,
    "identityDefects" TEXT NOT NULL DEFAULT '[]',
    "identityNotes" TEXT,
    "packagingOk" BOOLEAN NOT NULL DEFAULT true,
    "productOk" BOOLEAN NOT NULL DEFAULT true,
    "qualityOk" BOOLEAN NOT NULL DEFAULT true,
    "qualityDefects" TEXT NOT NULL DEFAULT '[]',
    "qualityNotes" TEXT,
    "deliveryNotePresent" BOOLEAN NOT NULL DEFAULT true,
    "dataMatchesOrder" BOOLEAN NOT NULL DEFAULT true,
    "documentDefects" TEXT NOT NULL DEFAULT '[]',
    "actions" TEXT NOT NULL DEFAULT '[]',
    "actionDescription" TEXT,
    "complaintSent" BOOLEAN NOT NULL DEFAULT false,
    "released" BOOLEAN NOT NULL DEFAULT false,
    "storedAt" TEXT,
    "signatureInspector" TEXT,
    "notes" TEXT
);
INSERT INTO "new_Inspection" ("actionDescription", "actions", "articleNumberCorrect", "complaintSent", "correctArticle", "createdAt", "dataMatchesOrder", "deliveryNoteNumber", "deliveryNotePresent", "documentDefects", "id", "identityDefects", "identityNotes", "inspectionDate", "inspector", "notes", "orderNumber", "packagingOk", "productOk", "qualityDefects", "qualityNotes", "qualityOk", "quantityCorrect", "quantityDefects", "quantityDeviation", "released", "signatureInspector", "storedAt", "supplier") SELECT "actionDescription", "actions", "articleNumberCorrect", "complaintSent", "correctArticle", "createdAt", "dataMatchesOrder", "deliveryNoteNumber", "deliveryNotePresent", "documentDefects", "id", "identityDefects", "identityNotes", "inspectionDate", "inspector", "notes", "orderNumber", "packagingOk", "productOk", "qualityDefects", "qualityNotes", "qualityOk", "quantityCorrect", "quantityDefects", "quantityDeviation", "released", "signatureInspector", "storedAt", "supplier" FROM "Inspection";
DROP TABLE "Inspection";
ALTER TABLE "new_Inspection" RENAME TO "Inspection";
CREATE INDEX "Inspection_supplier_idx" ON "Inspection"("supplier");
CREATE INDEX "Inspection_createdAt_idx" ON "Inspection"("createdAt");
CREATE INDEX "Inspection_inspector_idx" ON "Inspection"("inspector");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Article_name_key" ON "Article"("name");
