// @flow
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import schema from './schema';
import runLambda from './lambda';
import { initIPFS } from './ipfs';

const { address } = window.__args__;
if (address) {
  console.log(`Init IPFS node using swarm address ${address}`);
  initIPFS(address);
} else {
  console.error(`No swarm address passed from window.__args__: ${window.__args__}`);
}

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
