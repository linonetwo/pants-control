// @flow
import { createRoutine } from 'redux-saga-routines';

export const appStart = createRoutine('@core/appStart');
export const loadNote = createRoutine('@core/loadNote');
export const saveNote = createRoutine('@core/saveNote');
export const focusNote = createRoutine('@core/focusNote');
