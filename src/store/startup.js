// @flow
import { put, take } from 'redux-saga/effects';

import { loadConfigAction } from './config';
import { loadCardFromFsAction } from './cards';

import type { IOEffect } from 'redux-saga/effects';

// ████████╗ █████╗ ███████╗██╗  ██╗
// ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
//    ██║   ███████║███████╗█████╔╝
//    ██║   ██╔══██║╚════██║██╔═██╗
//    ██║   ██║  ██║███████║██║  ██╗
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

export default function* StartUpSaga(): Generator<IOEffect, void, any> {
  yield put(loadConfigAction.trigger());
  yield take(loadConfigAction.SUCCESS);
  yield put(loadCardFromFsAction.trigger());
}
