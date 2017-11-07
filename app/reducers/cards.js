// @flow
import { delay } from 'bluebird';
import { findIndex, toPairs } from 'lodash';
import { createRoutine } from 'redux-saga-routines';
import { all, takeLatest, put, select } from 'redux-saga/effects';

import { getPropertyByRuleMatchingAction } from './nlp';

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

// ████████╗ █████╗ ███████╗██╗  ██╗
// ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
//    ██║   ███████║███████╗█████╔╝
//    ██║   ██╔══██║╚════██║██╔═██╗
//    ██║   ██║  ██║███████║██║  ██╗
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝


export default function* cardSaga() {
  yield all([]);
}

// ███████╗████████╗ ██████╗ ██████╗ ███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
// ███████╗   ██║   ██║   ██║██████╔╝█████╗
// ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝
// ███████║   ██║   ╚██████╔╝██║  ██║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝

export type CardsInitialStateType = {
  userInputProperties: string[][], // [[key, value], ...]
};

const cardsInitialState: CardsInitialStateType = {
  userInputProperties: [],
};

export function cardsReducer(state: CardsInitialStateType = cardsInitialState, action: ActionType) {
  switch (action.type) {
    case getPropertyByRuleMatchingAction.SUCCESS:
      return {
        ...state,
        userInputProperties: toPairs(action.payload),
      };
    default:
      return state;
  }
}
