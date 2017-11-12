// @flow
import { delay } from 'bluebird';
import { findIndex, toPairs } from 'lodash';
import { createRoutine } from 'redux-saga-routines';
import { all, takeLatest, put, select } from 'redux-saga/effects';
import { Map, List, fromJS } from 'immutable';

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

type Card = {
  id: string,
  tags: string[][], // [[key, value], ...]
  content: string, // stringified EditorState
  focused: boolean, // focused card will parse stringified EditorState then you can edit it
};

export type CardsInitialStateType = {
  cards: Array<Card>,
};

const cardsInitialState: Map<CardsInitialStateType> = fromJS({
  cards: [],
});

export function cardsReducer(
  state: Map<CardsInitialStateType> = cardsInitialState,
  action: ActionType,
): Map<CardsInitialStateType> {
  switch (action.type) {
    case getPropertyByRuleMatchingAction.SUCCESS: {
      const thisCardIndex = state.get('cards').findIndex(aCard => aCard.id === action.payload.id);
      return {
        ...state,
        cards: state.setIn(['cards', thisCardIndex, 'tags'], fromJS(action.payload.tags)),
      };
    }
    default:
      return state;
  }
}
