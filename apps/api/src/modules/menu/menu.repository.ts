import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { menuItems } from "../../db/schema.js";
export const menuRepository = {
  list: () => db.select().from(menuItems).where(eq(menuItems.isAvailable, true)),
  findById: async (id: string) => (await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1))[0]
};
