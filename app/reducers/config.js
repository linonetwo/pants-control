// @flow
import { createRoutine } from 'redux-saga-routines';
import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { Map, fromJS } from 'immutable';
import { remote } from 'electron';
import storage from 'electron-json-storage';
import fixPath from 'fix-path';
import path from 'path';
import uuidv4 from 'uuid/v4';

import type { IOEffect } from 'redux-saga/effects';

import { addNewCardAction } from './cards';

type ActionType = {
  type: string,
  payload: any,
};

type Config = {
  noteLoaderID?: string,
  noteSaveerID?: string,
};

//  █████╗ ██████╗ ██╗
// ██╔══██╗██╔══██╗██║
// ███████║██████╔╝██║
// ██╔══██║██╔═══╝ ██║
// ██║  ██║██║     ██║
// ╚═╝  ╚═╝╚═╝     ╚═╝

storage.setDataPath(path.join(remote.app.getPath('appData'), 'PantsControl', 'config'));
fixPath();
function saveConfigToFs(config: Config): Promise<void> {
  return new Promise((resolve, reject) =>
    storage.set('config', JSON.stringify(config), error => {
      if (error) return reject(error);
      return resolve();
    }),
  );
}

function loadConfigFromFs(): Promise<Config> {
  return new Promise((resolve, reject) =>
    storage.get('config', (error, data) => {
      if (error) return reject(error);
      if (!data || typeof data !== 'string') return resolve({});
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
      if (error) return reject(error);
      if (!data || typeof data !== 'string') return resolve('');
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

export const setAsConfigAction = createRoutine('setAsConfig');
export const saveConfigAction = createRoutine('saveConfig');
function* setAsConfig(action) {
  const { content, id }: { content: string, id: string } = action.payload;
  try {
    const config = JSON.parse(content);
    yield put(saveConfigAction.trigger({ config, id }));
  } catch (error) {
    yield put(setAsConfigAction.failure(content, error));
    console.error(error);
  }
}

function* saveConfig(action) {
  const { config, id }: { config: Config, id: string } = action.payload;
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
    let [config, id]: [Config, string] = yield all([call(loadConfigFromFs), call(loadKeyFromFs, 'configID')]);
    // 如果是第一次运行还没有 config
    if (!config) {
      config = {};
      yield call(saveConfigToFs, config);
    }
    if (!id) {
      id = yield call(uuidv4);
      yield call(saveKeyToFs, 'configID', id);
      yield put(addNewCardAction.request({ id, content: JSON.stringify(config) }));
    }
    yield put(loadConfigAction.success({ config, id }));
  } catch (error) {
    yield put(loadConfigAction.failure(error));
    console.error(error);
  }
}

export default function* configSaga(): Generator<IOEffect, void, any> {
  yield all([
    takeLatest(saveConfigAction.TRIGGER, saveConfig),
    takeLatest(loadConfigAction.TRIGGER, loadConfig),
    takeLatest(setAsConfigAction.TRIGGER, setAsConfig),
  ]);
}

// ███████╗████████╗ ██████╗ ██████╗ ███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
// ███████╗   ██║   ██║   ██║██████╔╝█████╗
// ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝
// ███████║   ██║   ╚██████╔╝██║  ██║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝

export type ConfigInitialStateType = {
  configID: string,
  config: Config,
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
    case setAsConfigAction.SUCCESS:
    case loadConfigAction.SUCCESS:
    case saveConfigAction.SUCCESS: {
      const { config, id }: { config: Config, id: string } = action.payload;
      return state.set('config', state.get('config').merge(fromJS(config))).set('configID', id);
    }
    default:
      return state;
  }
}
