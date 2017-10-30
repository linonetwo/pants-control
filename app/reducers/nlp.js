// @flow
import { createRoutine } from 'redux-saga-routines';
import { takeLatest, call, all, put } from 'redux-saga/effects';
import Segmentit, { useDefault } from 'segmentit';

type ActionType = {
  type: string,
  payload: any,
};

//  █████╗ ██████╗ ██╗
// ██╔══██╗██╔══██╗██║
// ███████║██████╔╝██║
// ██╔══██║██╔═══╝ ██║
// ██║  ██║██║     ██║
// ╚═╝  ╚═╝╚═╝     ╚═╝

const segmentit = useDefault(new Segmentit());
type SegmentToken = {
  w: string,
  p: ?number,
};
function annoTateText(content: string): Array<SegmentToken> {
  return segmentit.doSegment(content);
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
