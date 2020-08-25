import { logging, timing } from "./utils/logging.ts";
import { errorHandler } from "./utils/errorHandler.ts";
import { oakCors, Application } from "./deps.ts";
import { GraphQLService } from "./graphql.ts";

(async () => {
  const port = 8000;

  const app = new Application();

  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
  app.use(oakCors());
  app.use(logging, timing);
  app.use(errorHandler);

  console.log(`Listening on http://localhost:${port}`);
  await app.listen({ port: port });
})();
