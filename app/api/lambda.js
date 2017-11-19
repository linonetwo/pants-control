import vm from 'vm';
import fs from 'fs';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { store } from '../store';

export default async function runLambda(req, res) {
  const { noteID, sectionID } = req.params;
  const matchedCard = store.getState().cards.get('cards').find(card => card.get('id') === noteID);
  if (matchedCard && matchedCard.get('content').blocks) {
    const code: string = matchedCard.get('content').blocks.map(block => block.text).join('\n');
    let stdout = '';
    const client = new ApolloClient({
      link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
      cache: new InMemoryCache(),
    });
    stdout = String(await vm.runInNewContext(code, { client, gql, console, fs }));
    res.send(stdout);
  } else {
    res.send(req.params);
  }
}
