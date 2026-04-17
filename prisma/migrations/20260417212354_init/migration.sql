-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspectionDate" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Inspection_supplier_idx" ON "Inspection"("supplier");

-- CreateIndex
CREATE INDEX "Inspection_createdAt_idx" ON "Inspection"("createdAt");

-- CreateIndex
CREATE INDEX "Inspection_inspector_idx" ON "Inspection"("inspector");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");
