import { makeExecutableSchema } from 'graphql-tools';
import fs from 'fs-extra';

const _profiles = {};

// Define your types here.
const typeDefs = `
  type Note {
    id: ID!,
    content: String,
  }

  type Viewer {
    allNotes: [Note]!,
    note(noteID: ID!): Note!,
  }

  type Query {
    viewer(viewerID: ID!): Viewer,
  }

  type Mutation {
    setProfile (
      viewerID: ID!,
      profile: String!,
    ): String
  }
`;

function getProfile(viewerID) {
  const profile = _profiles[viewerID];
  return profile;
}

const resolvers = {
  Viewer: {
    allNotes: async ({ viewerID }) => {
      const profile = getProfile(viewerID);
      const storagePath = profile['@core/storagePath'];
      return (await fs.readdir(storagePath)).map(fileName => ({ id: fileName }));
    },
    note: async ({ viewerID }, { noteID }) => {
      const profile = getProfile(viewerID);
      const storagePath = profile['@core/storagePath'];
      const content = await fs.readFile(`${storagePath}/${noteID}`, 'utf-8');
      return {
        id: noteID,
        content,
      };
    },
  },
  Mutation: {
    setProfile: (_, { viewerID, profile }) => {
      _profiles[viewerID] = profile;
    },
  },
};

// Generate the schema object from your types definition.
export default makeExecutableSchema({ typeDefs, resolvers });
