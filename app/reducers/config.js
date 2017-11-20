// @flow
import { createRoutine } from 'redux-saga-routines';
import { takeLatest, call, all, put } from 'redux-saga/effects';
import { Map, fromJS } from 'immutable';
import storage from 'electron-json-storage';
import fixPath from 'fix-path';
import os from 'os';
import uuidv4 from 'uuid/v4';

type ActionType = {
  type: string,
  payload: Object,
};

//  █████╗ ██████╗ ██╗
// ██╔══██╗██╔══██╗██║
// ███████║██████╔╝██║
// ██╔══██║██╔═══╝ ██║
// ██║  ██║██║     ██║
// ╚═╝  ╚═╝╚═╝     ╚═╝

storage.setDataPath(os.tmpdir());
fixPath();
function saveConfigToFs(config: Object): Promise<void> {
  return new Promise((resolve, reject) =>
    storage.set('config', JSON.stringify(config), error => {
      if (error) return reject(error);
      return resolve();
    }),
  );
}

function loadConfigFromFs(): Promise<Object> {
  return new Promise((resolve, reject) =>
    storage.get('config', (error, data) => {
      if (error || !data || typeof data !== 'string') return reject(error);
      return resolve(JSON.parse(data));
    }),
  );
}

function saveKeyToFs(key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) =>
    storage.set(key, value, error => {
      if (error) return reject(error);
      return resolve();
    }),
  );
}

function loadKeyFromFs(key: string): Promise<string> {
  return new Promise((resolve, reject) =>
    storage.get(key, (error, data) => {
      if (error || !data || typeof data !== 'string') return reject(error);
      return resolve(data);
    }),
  );
}

// ████████╗ █████╗ ███████╗██╗  ██╗
// ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
//    ██║   ███████║███████╗█████╔╝
//    ██║   ██╔══██║╚════██║██╔═██╗
//    ██║   ██║  ██║███████║██║  ██╗
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

export const saveConfigAction = createRoutine('saveConfig');
function* saveConfig(action) {
  const { config, id }: { config: Object, id: string } = action.payload;
  try {
    yield all([call(saveConfigToFs, config), call(saveKeyToFs, 'configID', id)]);
    yield put(saveConfigAction.success({ config, id }));
  } catch (error) {
    yield put(saveConfigAction.failure(error));
    console.error(error);
  }
}

export const loadConfigAction = createRoutine('loadConfig');
function* loadConfig() {
  try {
    let [config, id]: [Object, string] = yield all([call(loadConfigFromFs), call(loadKeyFromFs('configID'))]);
    // 如果是第一次运行还没有 config
    if (!config) {
      config = {};
      yield call(saveConfigToFs, config);
    }
    if (!id) {
      id = uuidv4();
      yield call(saveKeyToFs, 'configID', id);
    }
    yield put(loadConfigAction.success({ config, id }));
  } catch (error) {
    yield put(loadConfigAction.failure(error));
    console.error(error);
  }
}

export default function* configSaga() {
  yield all([takeLatest(saveConfigAction.TRIGGER, saveConfig), takeLatest(loadConfigAction.TRIGGER, loadConfig)]);
}

// ███████╗████████╗ ██████╗ ██████╗ ███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
// ███████╗   ██║   ██║   ██║██████╔╝█████╗
// ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝
// ███████║   ██║   ╚██████╔╝██║  ██║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝

export type ConfigInitialStateType = {
  configID: string,
  config: Object,
};

const configInitialState: Map<ConfigInitialStateType> = fromJS({
  configID: '',
  config: {},
});

export function configReducer(
  state: Map<ConfigInitialStateType> = configInitialState,
  action: ActionType,
): Map<ConfigInitialStateType> {
  switch (action.type) {
    case loadConfigAction.SUCCESS:
    case saveConfigAction.SUCCESS: {
      const { config, id }: { config: Object, id: string } = action.payload;
      return state.set('config', state.get('config').merge(fromJS(config))).set('configID', id);
    }
    default:
      return state;
  }
}
