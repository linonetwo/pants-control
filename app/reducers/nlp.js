// @flow
import { createRoutine } from 'redux-saga-routines';
import { takeLatest, call, all, put } from 'redux-saga/effects';
import Segmentit, { useDefault, enPOSTag } from 'segmentit';
import { isEqual } from 'lodash';

import addInventory from '../knowledge/addInventory.json';

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
  p: string,
};
function annoTateText(content: string): Array<SegmentToken> {
  return segmentit.doSegment(content).map(item => ({ w: item.w, p: enPOSTag(item.p) }));
}

type Rule = {
  example: string,
  rule: string,
  fields: Array<string>,
};
function nerByRules(rules: Array<Rule>, tokens: Array<SegmentToken>): { [x: string]: string } {
  const properties = {};
  console.log(tokens)
  rules.forEach(({ rule, fields }) => {
    const ruleForMatching = rule.split(' ');
    if (ruleForMatching.length === tokens.length && isEqual(ruleForMatching, tokens.map(i => i.p))) {
      for (let index = 0; index < fields.length; index += 1) {
        const field = fields[index];
        console.log(field)
        properties[field] = tokens[index].w;
      }
    }
  });
  return properties;
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
    const tokens: Array<SegmentToken> = annoTateText(text);
    console.log(nerByRules(addInventory.rules, tokens));
    yield put(textInputAction.success());
  } catch (error) {
    yield put(textInputAction.failure(error));
    console.error(error);
  }
}

export default function* NLPSaga() {
  yield all([takeLatest(textInputAction.TRIGGER, processTextOnType)]);
}
