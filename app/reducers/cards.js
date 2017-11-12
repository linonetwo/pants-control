// @flow
import { delay } from 'bluebird';
import { findIndex, toPairs } from 'lodash';
import { createRoutine } from 'redux-saga-routines';
import { all, takeLatest, put, select } from 'redux-saga/effects';
import { Map, List, fromJS } from 'immutable';
import uuidv5 from 'uuid/v5';

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

export const addNewCardAction = createRoutine('addNewCard');

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
    case addNewCardAction.TRIGGER: {
      const id = uuidv5('http://example.com/hello', uuidv5.URL);
      return state.set(
        'cards',
        state.get('cards').unshift(
          fromJS({
            id,
            tags: [],
            content: '',
            focused: true,
          }),
        ),
      );
    }
    case getPropertyByRuleMatchingAction.SUCCESS: {
      const thisCardIndex = state.get('cards').findIndex(aCard => aCard.id === action.payload.id);
      return state.setIn(['cards', thisCardIndex, 'tags'], fromJS(action.payload.tags));
    }
    default:
      return state;
  }
}
