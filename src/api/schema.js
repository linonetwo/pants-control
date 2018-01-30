import { makeExecutableSchema } from 'graphql-tools';
import { store } from '../store';

// Define your types here.
const typeDefs = `
  type Card {
    id: ID!
    tags: [[String]]!
  }

  type Query {
    allCards: [Card]!
  }
`;

const resolvers = {
  Query: {
    allCards: () => store.getState().cards.get('cards').toJS(),
  },
};

// Generate the schema object from your types definition.
export default makeExecutableSchema({ typeDefs, resolvers });
