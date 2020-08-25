import { denodb } from "./deps.ts";
import { User } from "./model.ts";

const db = new denodb.Database("postgres", {
  database: "postgres",
  host: "db",
  username: "postgres",
  password: "postgres",
});

const ping_response = db.ping().then((res) => {
  if (!ping_response) throw Error("No response from database connection test");
  else console.log("Connection to database established.");
});

db.link([User]);

await db.sync({ drop: true });
console.log("Database has been syncronized.");

export { db };
