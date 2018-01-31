// @flow
import Immutable, { type Immutable as ImmutableType } from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

import type { ActionType, KeyValue } from './types';

export const loadProfile = createRoutine('@core/loadProfile');

type ViewerInitialStateType = {
  profile: KeyValue,
};

const viewerInitialState: ImmutableType<ViewerInitialStateType> = Immutable({
  profile: {},
});

export function viewerReducer(
  state: ImmutableType<ViewerInitialStateType> = viewerInitialState,
  action: ActionType,
): ImmutableType<ViewerInitialStateType> {
  switch (action.type) {
    case loadProfile.SUCCESS:
      (action.payload: KeyValue);
      return state.setIn('profile', action.payload);

    default:
      return state;
  }
}
