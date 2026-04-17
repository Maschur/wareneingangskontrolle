import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const sql = readFileSync("prisma/migrations/20260417212354_init/migration.sql", "utf-8");

// Split on semicolons and execute each statement
const statements = sql.split(";").map(s => s.trim()).filter(s => s.length > 0);

for (const stmt of statements) {
  console.log("Executing:", stmt.slice(0, 60) + "...");
  await client.execute(stmt);
}

console.log("\n✓ Turso migration complete!");
client.close();
