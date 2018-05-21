// @flow
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';

export const history = createHistory();

type State = {};
export default (initialState?: * = {}) => ({
  state: {},
  effects: {},
  ...initialState,
});
