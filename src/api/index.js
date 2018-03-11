// @flow
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import schema from './schema';
import runLambda from './lambda';

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
