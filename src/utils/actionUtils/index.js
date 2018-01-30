// @flow
type ActionType = {
  type: string,
  payload: any,
};

export const addIDToAction = (action: ActionType, id: string) => ({
  ...action,
  type: `${action.type}-${id}`,
});

export const addIDToType = (type: string, id: string) => `${type}-${id}`;
