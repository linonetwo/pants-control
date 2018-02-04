// @flow
import { delay, mapTo } from 'rxjs/operators';
import { ofType } from 'redux-observable';

import { appStart } from '../../actions/core';

/** defaultNoteOnStartUp
 * if no note exist
 * load default notes, add them to ipfs, add multihash to notes store cache
 * set current note to one of default note.
 * */
export default action => action
  .pipe(
    ofType(appStart.TRIGGER),
    delay(1000),
    mapTo({ type: 'PONG' })
  );
