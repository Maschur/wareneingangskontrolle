"use server";

import { prisma } from "@/lib/db";
import { DEFAULT_SUPPLIERS } from "@/lib/constants";
import type { InspectionInput } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── Neue Prüfung speichern ──
export async function createInspection(data: InspectionInput): Promise<string> {
  const record = await prisma.inspection.create({
    data: {
      inspectionDate: data.inspectionDate,
      supplier: data.supplier,
      articleName: data.articleName,
      orderNumber: data.orderNumber,
      deliveryNoteNumber: data.deliveryNoteNumber,
      inspector: data.inspector,
      quantityCorrect: data.quantityCorrect,
      quantityDeviation: data.quantityDeviation || null,
      quantityDefects: JSON.stringify(data.quantityDefects),
      correctArticle: data.correctArticle,
      articleNumberCorrect: data.articleNumberCorrect,
      identityDefects: JSON.stringify(data.identityDefects),
      identityNotes: data.identityNotes || null,
      packagingOk: data.packagingOk,
      productOk: data.productOk,
      qualityOk: data.qualityOk,
      qualityDefects: JSON.stringify(data.qualityDefects),
      qualityNotes: data.qualityNotes || null,
      deliveryNotePresent: data.deliveryNotePresent,
      dataMatchesOrder: data.dataMatchesOrder,
      documentDefects: JSON.stringify(data.documentDefects),
      actions: JSON.stringify(data.actions),
      actionDescription: data.actionDescription || null,
      released: data.released,
      storedAt: data.storedAt || null,
      signatureInspector: data.signatureInspector || null,
    },
  });

  revalidatePath("/entries");
  revalidatePath("/stats");
  revalidatePath("/");
  return record.id;
}

// ── Alle Prüfungen laden ──
export async function getInspections(search?: string, limit?: number) {
  const where = search
    ? {
        OR: [
          { supplier: { contains: search } },
          { orderNumber: { contains: search } },
          { deliveryNoteNumber: { contains: search } },
          { inspector: { contains: search } },
        ],
      }
    : {};

  const records = await prisma.inspection.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const fmt = (d: unknown) => d instanceof Date ? d.toISOString().slice(0, 10) : String(d);
  return records.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    inspectionDate: fmt(r.inspectionDate),
    supplier: r.supplier,
    articleName: r.articleName,
    orderNumber: r.orderNumber,
    deliveryNoteNumber: r.deliveryNoteNumber,
    inspector: r.inspector,
    quantityCorrect: r.quantityCorrect,
    quantityDeviation: r.quantityDeviation,
    quantityDefects: JSON.parse(r.quantityDefects) as string[],
    correctArticle: r.correctArticle,
    articleNumberCorrect: r.articleNumberCorrect,
    identityDefects: JSON.parse(r.identityDefects) as string[],
    identityNotes: r.identityNotes,
    packagingOk: r.packagingOk,
    productOk: r.productOk,
    qualityOk: r.qualityOk,
    qualityDefects: JSON.parse(r.qualityDefects) as string[],
    qualityNotes: r.qualityNotes,
    deliveryNotePresent: r.deliveryNotePresent,
    dataMatchesOrder: r.dataMatchesOrder,
    documentDefects: JSON.parse(r.documentDefects) as string[],
    actions: JSON.parse(r.actions) as string[],
    actionDescription: r.actionDescription,
    complaintSent: r.complaintSent,
    released: r.released,
    storedAt: r.storedAt,
    signatureInspector: r.signatureInspector,
    notes: r.notes,
  }));
}

// ── Einzelne Prüfung laden ──
export async function getInspection(id: string) {
  const r = await prisma.inspection.findUnique({
    where: { id },
  });
  if (!r) return null;

  const fmt = (d: unknown) => d instanceof Date ? d.toISOString().slice(0, 10) : String(d);
  return {
    id: r.id,
    createdAt: r.createdAt,
    inspectionDate: fmt(r.inspectionDate),
    supplier: r.supplier,
    articleName: r.articleName,
    orderNumber: r.orderNumber,
    deliveryNoteNumber: r.deliveryNoteNumber,
    inspector: r.inspector,
    quantityCorrect: r.quantityCorrect,
    quantityDeviation: r.quantityDeviation,
    quantityDefects: JSON.parse(r.quantityDefects) as string[],
    correctArticle: r.correctArticle,
    articleNumberCorrect: r.articleNumberCorrect,
    identityDefects: JSON.parse(r.identityDefects) as string[],
    identityNotes: r.identityNotes,
    packagingOk: r.packagingOk,
    productOk: r.productOk,
    qualityOk: r.qualityOk,
    qualityDefects: JSON.parse(r.qualityDefects) as string[],
    qualityNotes: r.qualityNotes,
    deliveryNotePresent: r.deliveryNotePresent,
    dataMatchesOrder: r.dataMatchesOrder,
    documentDefects: JSON.parse(r.documentDefects) as string[],
    actions: JSON.parse(r.actions) as string[],
    actionDescription: r.actionDescription,
    complaintSent: r.complaintSent,
    released: r.released,
    storedAt: r.storedAt,
    signatureInspector: r.signatureInspector,
    notes: r.notes,
  };
}

// ── Prüfung löschen ──
export async function deleteInspection(id: string) {
  await prisma.inspection.delete({ where: { id } });
  revalidatePath("/entries");
  revalidatePath("/stats");
  redirect("/entries");
}

// ── Reklamation als gesendet markieren ──
export async function markComplaintSent(id: string) {
  await prisma.inspection.update({
    where: { id },
    data: { complaintSent: true },
  });
  revalidatePath(`/entries/${id}`);
}

// ── Statistik ──
export async function getStats(days?: number) {
  const where = days
    ? { createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } }
    : {};

  const inspections = await prisma.inspection.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const parsed = inspections.map((r) => ({
    ...r,
    quantityDefects: JSON.parse(r.quantityDefects) as string[],
    identityDefects: JSON.parse(r.identityDefects) as string[],
    qualityDefects: JSON.parse(r.qualityDefects) as string[],
    documentDefects: JSON.parse(r.documentDefects) as string[],
    actions: JSON.parse(r.actions) as string[],
  }));

  const totalInspections = parsed.length;
  const totalReleased = parsed.filter((r) => r.released).length;
  const totalWithDefects = parsed.filter(
    (r) =>
      r.quantityDefects.length > 0 ||
      r.identityDefects.length > 0 ||
      r.qualityDefects.length > 0 ||
      r.documentDefects.length > 0
  ).length;
  const defectRate = totalInspections > 0 ? (totalWithDefects / totalInspections) * 100 : 0;

  // Alle Mängel zählen
  const defectCounts: Record<string, number> = {};
  for (const r of parsed) {
    for (const d of [...r.quantityDefects, ...r.identityDefects, ...r.qualityDefects, ...r.documentDefects]) {
      defectCounts[d] = (defectCounts[d] || 0) + 1;
    }
  }

  // Pro Lieferant
  const bySupplier: Record<string, { total: number; withDefects: number }> = {};
  for (const r of parsed) {
    if (!bySupplier[r.supplier]) bySupplier[r.supplier] = { total: 0, withDefects: 0 };
    bySupplier[r.supplier].total += 1;
    const hasDefects =
      r.quantityDefects.length > 0 ||
      r.identityDefects.length > 0 ||
      r.qualityDefects.length > 0 ||
      r.documentDefects.length > 0;
    if (hasDefects) bySupplier[r.supplier].withDefects += 1;
  }

  // Maßnahmen
  const actionCounts: Record<string, number> = {};
  for (const r of parsed) {
    for (const a of r.actions) {
      actionCounts[a] = (actionCounts[a] || 0) + 1;
    }
  }

  return {
    totalInspections,
    totalReleased,
    totalWithDefects,
    defectRate,
    defectCounts,
    bySupplier,
    actionCounts,
    recentInspections: parsed.slice(0, 5),
  };
}

// ── Lieferanten ──

export async function seedSuppliers() {
  const count = await prisma.supplier.count();
  if (count === 0) {
    for (const name of DEFAULT_SUPPLIERS) {
      await prisma.supplier.create({ data: { name } });
    }
  }
}

export async function getSuppliers(): Promise<string[]> {
  await seedSuppliers();
  const rows = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => r.name);
}

export async function addSupplier(name: string, email?: string): Promise<{ error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Name darf nicht leer sein." };

  const existing = await prisma.supplier.findUnique({ where: { name: trimmed } });
  if (existing) return { error: "Lieferant existiert bereits." };

  await prisma.supplier.create({ data: { name: trimmed, email: email?.trim() || null } });
  revalidatePath("/settings");
  revalidatePath("/new");
  return {};
}

export async function deleteSupplier(id: string) {
  await prisma.supplier.delete({ where: { id } });
  revalidatePath("/settings");
  revalidatePath("/new");
}

export async function getSuppliersWithIds() {
  await seedSuppliers();
  return prisma.supplier.findMany({ orderBy: { name: "asc" } });
}

export async function updateSupplierEmail(id: string, email: string) {
  await prisma.supplier.update({ where: { id }, data: { email: email.trim() || null } });
  revalidatePath("/settings");
}

// ── Artikel ──

export async function getArticles(): Promise<string[]> {
  const rows = await prisma.article.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => r.name);
}

export async function getArticlesWithIds() {
  return prisma.article.findMany({ orderBy: { name: "asc" } });
}

export async function addArticle(name: string): Promise<{ error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Name darf nicht leer sein." };

  const existing = await prisma.article.findUnique({ where: { name: trimmed } });
  if (existing) return { error: "Artikel existiert bereits." };

  await prisma.article.create({ data: { name: trimmed } });
  revalidatePath("/settings");
  revalidatePath("/new");
  return {};
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({ where: { id } });
  revalidatePath("/settings");
  revalidatePath("/new");
}
