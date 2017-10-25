import { textInputAction } from '../reducers/nlp';
import find from './search';

// 接收 Saga 的计算请求，并在计算后返回一个带结果的 Action
self.onmessage = ({ data: actionString }) => {
  const action = JSON.parse(actionString);
  // console.log(Date.now())
  if (action.type === textInputAction.TRIGGER) {
    try {
      const [splitedRawText, value, keys] = action.payload;
      const findResult = find(splitedRawText, value, keys);
      // console.log(Date.now())
      self.postMessage(JSON.stringify(textInputAction.success(findResult)));
    } catch (error) {
      self.postMessage(textInputAction.failure(error));
      console.error(error);
    }
  }
};
