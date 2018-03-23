// @flow
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';

import { viewerRegister, loadNote, focusNote } from '../../actions/core';
import type { IPFSFileUploader } from '../../types';

import defaultMenuNote from './defaultMenuNote.json';

/** defaultNoteOnStartUp
 * if no note exist
 * load default notes, add them to ipfs, add multihash to notes store cache
 * set current note to one of default note.
 * */
export default (action: any, store: any, { ipfs }: { ipfs: IPFSFileUploader }) =>
  action.pipe(
    ofType(viewerRegister.SUCCESS),
    mergeMap(() => {
      if (!ipfs) {
        console.error('In epic defaultNote: No ipfs passed from dependency.');
        return Observable.empty();
      }
      return Observable.fromPromise(ipfs.uploadObject(defaultMenuNote));
    }),
    mergeMap(({ hash }) =>
      Observable.concat(
        Observable.of(loadNote.success({ id: hash, note: defaultMenuNote })),
        Observable.of(focusNote(hash)),
      ),
    ),
  );
