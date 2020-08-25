import { denodb } from "./deps.ts";
import { User } from "./model.ts";

const db = new denodb.Database("postgres", {
  database: "postgres",
  host: "db",
  username: "postgres",
  password: "postgres",
});

console.log("Checking database connection");
const ping_response = await db.ping();
if (!ping_response) throw Error("No response from database");

console.log("Synchronizing database");
await db.link([User]).sync({ drop: true });

export { db };
