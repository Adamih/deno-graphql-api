import {
  applyGraphQL,
  gql,
  GQLError,
  v4,
  bcrypt,
  RouterContext,
  Router,
} from "./deps.ts";
import { db } from "./db.ts";
import { User } from "./model.ts";

// GraphQL type definitions
const types = gql`
  type User {
    id: String!
    username: String!
    hash: String!
  }

  type Query {
    User: [User!]!
  }

  type ResolveType {
    done: Boolean
  }

  type UserResolveType {
    User: User!
  }

  type Mutation {
    Register(username: String, password: String): ResolveType
    Login(username: String, password: String): UserResolveType
    DeleteUser(id: String): User
  }
`;

const resolvers = {
  /* query: {
    User {
      username
      password
    }
  } */
  Query: {
    User: async (parents: any, { id }: any, ctx: any) => {
      if (!id) return await User.where("id", id).get();
      return await User.all();
    },
  },
  /* mutation: {
    Register(username: "user", password: "secret") {
      done
    }
  } */
  Mutation: {
    Register: async (parents: any, { username, password }: any, ctx: any) => {
      const id = v4.generate();
      const hash_promise = bcrypt.hash(password);
      if (await User.where("username", username).count() === 0) {
        throw new GQLError(
          {
            type: "Invalid username",
            detail: "Username already taken",
          },
        );
      }
      const hash = await hash_promise;
      User.create({ id, username, hash });
      return { done: true };
    },
    Login: async (parents: any, { username, password }: any, ctx: any) => {
      const [user] = await User.where("username", username).get();
      if (!user || !await bcrypt.compare(password, user.hash)) {
        throw new GQLError(
          {
            type: "Invalid credentials",
            detail: "Invalid username or password",
          },
        );
      }

      return { User: user };
    },
    DeleteUser: async (parents: any, { id }: any, ctx: any) => {
      const user = await User.where("id", id).delete();
      if (!user) {
        throw new GQLError(
          {
            type: "Invalid id",
            detail: "No such user exist",
          },
        );
      }
      return { User: user };
    },
  },
};

const context = (ctx: RouterContext) => ({ db: db });

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
  context: context,
});

export { GraphQLService };
