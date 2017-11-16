// @flow
import { toPairs } from 'lodash';
import { createRoutine } from 'redux-saga-routines';
import { all, takeLatest, put, select } from 'redux-saga/effects';
import { Map, fromJS } from 'immutable';
import uuidv4 from 'uuid/v4';

import { getPropertyByRuleMatchingAction } from './nlp';

type ActionType = {
  type: string,
  payload: any,
};

export type Card = {
  id: string,
  tags: string[][], // [[key, value], ...]
  content: string, // stringified EditorState
  focused: boolean, // focused card will parse stringified EditorState then you can edit it
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
function* addNewCard() {
  const id = uuidv4();
  yield put(addNewCardAction.request({ id }));
}

export default function* cardSaga() {
  yield all([
    takeLatest(addNewCardAction.TRIGGER, addNewCard),
  ]);
}

// ███████╗████████╗ ██████╗ ██████╗ ███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
// ███████╗   ██║   ██║   ██║██████╔╝█████╗
// ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝
// ███████║   ██║   ╚██████╔╝██║  ██║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝

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
    case addNewCardAction.REQUEST: {
      const { id } = action.payload;
      return state.set(
        'cards',
        // add a new card
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
      const thisCardIndex = state.get('cards').findIndex(aCard => aCard.get('id') === action.payload.id);
      return state.setIn(['cards', thisCardIndex, 'tags'], fromJS(toPairs(action.payload.tags)));
    }
    default:
      return state;
  }
}
