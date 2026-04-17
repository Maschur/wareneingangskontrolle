import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Migration: add Article table + articleName column to Inspection
const statements = [
  `CREATE TABLE IF NOT EXISTS "Article" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Article_name_key" ON "Article"("name")`,
  `ALTER TABLE "Inspection" ADD COLUMN "articleName" TEXT NOT NULL DEFAULT ''`,
];

for (const stmt of statements) {
  console.log("Executing:", stmt.slice(0, 70) + "...");
  try {
    await client.execute(stmt);
  } catch (e) {
    // Ignore "duplicate column" errors for idempotency
    if (e.message?.includes("duplicate column")) {
      console.log("  (already exists, skipping)");
    } else {
      throw e;
    }
  }
}

console.log("\n✓ Turso migration complete!");
client.close();
