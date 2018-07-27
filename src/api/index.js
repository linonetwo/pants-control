// @flow
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';

import { typeDefs, resolvers } from './schema';
import runLambda from './lambda';

// Initialize the app
const app = express();
const whitelist = ['http://localhost:3000'];
app.use(
  cors({
    origin(origin, callback) {
      const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    },
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {},
  tracing: true,
  introspection: true,
  cacheControl: {
    defaultMaxAge: 5,
    stripFormattedExtensions: false,
    calculateCacheControlHeaders: false,
  },
  engine: false,
});
server.applyMiddleware({ app, gui: true });

app.all('/lambdav1/:noteID', bodyParser.json(), runLambda);

const SERVER_PORT = 6006
app.listen(SERVER_PORT, () => {
  console.log(`🚀 GraphQL Server ready at http://localhost:${SERVER_PORT}/graphql`);
});
