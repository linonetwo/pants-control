// @flow
import { call, put } from 'redux-saga/effects';

import { loadConfigAction } from './config';
import { loadCardFromFsAction } from './cards';

// ████████╗ █████╗ ███████╗██╗  ██╗
// ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
//    ██║   ███████║███████╗█████╔╝
//    ██║   ██╔══██║╚════██║██╔═██╗
//    ██║   ██║  ██║███████║██║  ██╗
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

export default function* StartUpSaga() {
  yield put(loadConfigAction());
  yield put(loadCardFromFsAction());
}
