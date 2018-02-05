// @flow
import { Observable } from 'rxjs';
import { delay, mapTo, flatMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';

import { appStart, loadNote, focusNote } from '../../actions/core';

import defaultProfile from './defaultProfile.json';

/** defaultNoteOnStartUp
 * if no note exist
 * load default notes, add them to ipfs, add multihash to notes store cache
 * set current note to one of default note.
 * */
export default (action, store, { ipfs }) => {
  if (!ipfs) {
    console.error('No ipfs passed from dependency.');
    return Observable.empty();
  }
  const profileHash = 'aaa';
  return action.pipe(
    ofType(appStart.TRIGGER),
    delay(1000),
    flatMap(action =>
      Observable.concat(
        Observable.of(loadNote.success({ id: profileHash, note: defaultProfile })),
        Observable.of(focusNote(profileHash)),
      )),
  );
};
