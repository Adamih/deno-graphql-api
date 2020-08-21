import {
  Router,
} from "https://deno.land/x/oak/mod.ts";
import {
  applyGraphQL,
  gql,
} from "https://deno.land/x/oak_graphql/mod.ts";

type Dino = {
  name: String;
  image: String;
};

// GraphQL type definitions
const types = gql`
  type Dino {
    name: String
    image: String
  }

  type Query {
    Dino: [Dino!]!
  }

  type ResolveType {
    done: Boolean
  }

  type Mutation {
    Dino(name: String, image: String): ResolveType
  }
`;

// In-memory database
const dinos: Dino[] = [
  {
    name: "T-rex",
    image: "https://images.dinosaurpictures.org/Tyrannosaurus_e9c1.jpg",
  },
];

const resolvers = {
  /* 
  query: {
    getDinos {
      name
      image
    }
  }
  */
  Query: {
    Dino: () => {
      return dinos;
    },
  },

  /*
  mutation: {
    addDino(name: "this-name", image: "http://url.co/path/image.svg") {
      done
    }
  }
  */
  Mutation: {
    Dino: (_: any, { name, image }: Dino) => {
      dinos.push({ name, image });
      return { done: true };
    },
  },
};

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
});

export { GraphQLService };
