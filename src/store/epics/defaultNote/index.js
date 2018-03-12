// @flow
import { Observable } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import str2arr from 'string-to-arraybuffer';

import { ipfsNodeStart, loadNote, focusNote } from '../../actions/core';
import type { ActionType, IPFSFileUploader } from '../../types';

import defaultProfile from './defaultProfile.json';

/** defaultNoteOnStartUp
 * if no note exist
 * load default notes, add them to ipfs, add multihash to notes store cache
 * set current note to one of default note.
 * */
export default (action: ActionType, store: any, { ipfs }: { ipfs: IPFSFileUploader }) =>
  action.pipe(
    ofType(ipfsNodeStart.TRIGGER),
    mergeMap(() => {
      if (!ipfs) {
        console.error('In epic defaultNote: No ipfs passed from dependency.');
        return Observable.empty();
      }
      const fileString = JSON.stringify(defaultProfile);
      const fileBuffer = str2arr(fileString);
      return Observable.fromPromise(ipfs.uploadArrayBuffer(fileBuffer)).map(result => ({ ...result, fileString }));
    }),
    mergeMap(({ hash, fileString }) => Observable.concat(
        Observable.of(loadNote.success({ id: hash, note: fileString })),
        Observable.of(focusNote(hash)),
      )),
  );
