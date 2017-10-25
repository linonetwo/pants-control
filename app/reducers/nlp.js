// @flow
import { createRoutine } from 'redux-saga-routines';
import { takeLatest, call, all, put } from 'redux-saga/effects';

type ActionType = {
  type: string,
  payload: any
};

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

export const textInputAction = createRoutine('textInput');

function* processTextOnType(action) {
  try {
    const text: string = action.payload;
    yield put(textInputAction.success(text));
  } catch (error) {
    yield put(textInputAction.failure(error));
    console.error(error);
  }
}

export default function* NLPSaga() {
  yield all([takeLatest(processTextOnType.TRIGGER, processTextOnType)]);
}
