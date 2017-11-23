// @flow
import { createRoutine } from 'redux-saga-routines';
import { takeLatest, call, all, put } from 'redux-saga/effects';

import vm from 'vm';
import fs from 'fs-extra';
import path from 'path';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { remote } from 'electron';

//  █████╗ ██████╗ ██╗
// ██╔══██╗██╔══██╗██║
// ███████║██████╔╝██║
// ██╔══██║██╔═══╝ ██║
// ██║  ██║██║     ██║
// ╚═╝  ╚═╝╚═╝     ╚═╝

// ████████╗ █████╗ ███████╗██╗  ██╗
// ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
//    ██║   ███████║███████╗█████╔╝
//    ██║   ██╔══██║╚════██║██╔═██╗
//    ██║   ██║  ██║███████║██║  ██╗
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

export const executeCodeAction = createRoutine('executeCode');
function* executeCode(action) {
  const { code, id, language }: { [x: string]: string } = action.payload;
  try {
    let stdout: any = '';
    if (language === 'js/babel') {
      const client = new ApolloClient({
        link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
        cache: new InMemoryCache(),
      });
      const asyncCode = `'use strict';
        async function runInVM() {
          try {
            ${code};
          } catch(error) {
            console.error(error);
          }
        };
        runInVM()`;
      stdout = yield vm.runInNewContext(asyncCode, { client, gql, console, fs, path, getPath: remote.app.getPath });
    }
    console.log(stdout);
    yield put(executeCodeAction.success({ id, stdout }));
  } catch (error) {
    yield put(executeCodeAction.failure({ id, error }));
    console.error(error);
  }
}

export default function* NLPSaga() {
  yield all([takeLatest(executeCodeAction.TRIGGER, executeCode)]);
}
