
import * as dotenv from "dotenv";
import { createPool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./packages/db/src/schema";

dotenv.config({ path: "./apps/web/.env" });

const client = createPool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(client, { schema });

async function main() {
    const missions = await db.query.mission.findMany();
    console.log(JSON.stringify(missions, null, 2));
}

main();
