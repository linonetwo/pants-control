// @flow
import { createRoutine } from 'redux-saga-routines';
import { takeLatest, call, all, put } from 'redux-saga/effects';
import nodejieba from 'nodejieba';

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

function annoTateText(content: string): string {
  return nodejieba.tag(content);
}

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
    yield put(textInputAction.success(annoTateText(text)));
  } catch (error) {
    yield put(textInputAction.failure(error));
    console.error(error);
  }
}

export default function* NLPSaga() {
  yield all([takeLatest(textInputAction.TRIGGER, processTextOnType)]);
}
