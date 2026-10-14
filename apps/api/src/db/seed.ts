import { db, sql } from "./client.js";
import { menuItems } from "./schema.js";
import { SEED_MENU } from "../modules/menu/menu.seed.js";
await db.insert(menuItems).values(SEED_MENU).onConflictDoNothing();
console.log("Menu seeded"); await sql.end();
