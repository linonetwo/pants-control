// @flow
import vm from 'vm';
import fs from 'fs-extra';
import path from 'path';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { remote } from 'electron';
import sha512 from 'hash.js/lib/hash/sha/512';

export default async function runLambda(req, res) {
  const { note } = req.params;
  const { noteHash } = req.query;
  const signature = window.__args__;
  if (note && window.__args__ && signature) {
    // naive checking, check signature, window.__args__ are passed in when app started
    const myHashOfNote = sha512()
      .update(note + signature)
      .digest('hex');
    if (noteHash !== myHashOfNote) {
      res.send({ ...req.params, reason: 'hash mismatch' });
    }

    // RUnning note
    let stdout: any = '';
    const client = new ApolloClient({
      link: new HttpLink({ uri: 'http://localhost:6012/graphql' }),
      cache: new InMemoryCache(),
    });
    const asyncCode = `'use strict';
    async function runInVM() {
      try {
        ${note};
      } catch(error) {
        console.error(error);
      }
    };
    runInVM()`;
    stdout = await vm.runInNewContext(asyncCode, {
      req,
      client,
      gql,
      console,
      fs,
      path,
      getPath: remote.app.getPath,
    });
    res.send(stdout);
  } else {
    res.send(req.params);
  }
}
