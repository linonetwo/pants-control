// @flow
import { createRoutine } from 'redux-saga-routines';
import { takeLatest, call, all, put } from 'redux-saga/effects';
import Segmentit, { useDefault, enPOSTag } from 'segmentit';
import { isEqual, omit } from 'lodash';

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
  rules.forEach(({ rule, fields }) => {
    const ruleForMatching = rule.split(' ');
    if (ruleForMatching.length === tokens.length && isEqual(ruleForMatching, tokens.map(i => i.p))) {
      for (let index = 0; index < fields.length; index += 1) {
        const field = fields[index];
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

function* segmentTextOnType(action) {
  try {
    const text: string = action.payload;
    const tokens: Array<SegmentToken> = annoTateText(text);
    yield put(textInputAction.success(tokens));
  } catch (error) {
    yield put(textInputAction.failure(error));
    console.error(error);
  }
}

export const getPropertyByRuleMatchingAction = createRoutine('getPropertyByRuleMatching');
function* getPropertyByRuleMatching(action) {
  try {
    const tokens: Array<SegmentToken> = action.payload;
    const properties = omit(nerByRules(addInventory.rules, tokens), ['_']);
    yield put(getPropertyByRuleMatchingAction.success(properties));
  } catch (error) {
    yield put(getPropertyByRuleMatchingAction.failure(error));
    console.error(error);
  }
}

export default function* NLPSaga() {
  yield all([
    takeLatest(textInputAction.TRIGGER, segmentTextOnType),
    takeLatest(textInputAction.SUCCESS, getPropertyByRuleMatching),
  ]);
}
