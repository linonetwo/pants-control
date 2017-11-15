import { textInputAction } from '../reducers/nlp';

// 接收 Saga 的计算请求，并在计算后返回一个带结果的 Action
self.onmessage = ({ data: actionString }) => {
  const action = JSON.parse(actionString);
  // console.log(Date.now())
  if (action.type === textInputAction.TRIGGER) {
    try {
      const text = action.payload;
      // console.log(Date.now())
      self.postMessage(JSON.stringify(textInputAction.fulfill(text)));
    } catch (error) {
      self.postMessage(textInputAction.failure(error));
      console.error(error);
    }
  }
};
