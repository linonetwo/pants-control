// @flow
import produce from 'immer';

import type { ActionType } from './types';
import { loading } from './actions/core';

type InfoInitialStateType = {
  // counting on how many threads are loading
  loadingCounter: number,
};

const infoInitialState: ImmutableType<InfoInitialStateType> = {
  loadingCounter: 0,
};

export const infoSagas = [];

export function infoReducer(
  state: ImmutableType<InfoInitialStateType> = infoInitialState,
  action: ActionType,
): ImmutableType<InfoInitialStateType> {
  return produce(state, draft => {
    switch (action.type) {
      case loading.TRIGGER:
        draft.loadingCounter += 1;
        break;
      case loading.SUCCESS:
        draft.loadingCounter -= 1;
        break;
      default: break;
    }
  })
}
