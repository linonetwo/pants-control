// @flow
import { createRoutine } from 'redux-saga-routines';

export const appStart = createRoutine('@core/appStart');
export const ipfsNodeStart = createRoutine('@core/ipfsNodeStart');
export const loading = createRoutine('@core/loading');
export const loadNote = createRoutine('@core/loadNote');
export const saveNote = createRoutine('@core/saveNote');
export const focusNote = createRoutine('@core/focusNote');
export const loadAvailableViewers = createRoutine('@core/loadAvailableViewers');
export const viewerRegister = createRoutine('@core/viewerRegister');
export const viewerLogin = createRoutine('@core/viewerLogin');
