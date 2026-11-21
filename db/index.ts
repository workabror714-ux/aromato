import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import fs from "node:fs";
import path from "node:path";

const dbUrl = process.env.DATABASE_URL ?? "./data/aromato.db";
const dir = path.dirname(dbUrl);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const sqlite = new Database(dbUrl);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
