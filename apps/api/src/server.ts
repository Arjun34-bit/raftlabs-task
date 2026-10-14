import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { sql } from "./db/client.js";
import { startOrderSimulation } from "./jobs/order-simulation.js";
const stopSimulation = startOrderSimulation();
const server = createApp().listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}`));
const shutdown = () => { stopSimulation(); server.close(async () => { await sql.end(); process.exit(0); }); };
process.on("SIGTERM", shutdown); process.on("SIGINT", shutdown);
