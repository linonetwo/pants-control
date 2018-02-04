// @flow
import { delay, mapTo } from 'rxjs/operators';
import { ofType } from 'redux-observable';

import { appStart } from '../actions/core';

export default action => action
  .pipe(
    ofType(appStart.TRIGGER),
    delay(1000),
    mapTo({ type: 'PONG' })
  );
