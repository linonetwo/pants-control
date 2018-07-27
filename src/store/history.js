// @flow
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

type State = {};
export default (initialState?: State = {}) => ({
  state: {},
  effects: {},
  ...initialState,
});
