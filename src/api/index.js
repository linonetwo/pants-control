// @flow
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import schema from './schema';
import runLambda from './lambda';
import { initIPFS } from './ipfs';

const { addresses } = window.__args__;
if (!addresses || !addresses[0]) {
  console.error(`No swarm addresses passed from window.__args__: ${JSON.stringify(window.__args__)}`);
} else {
  console.log(`Init IPFS node using swarm addresses ${addresses[0]}`);
  const ipfs = initIPFS(addresses);

  const app = express();
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
    }),
  );

  app.all('/lambdav1/:noteID', bodyParser.json(), runLambda);

  app.listen(6006);
}
