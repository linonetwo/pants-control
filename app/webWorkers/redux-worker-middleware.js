// import Perf from 'react-addons-perf';

const createWorkerMiddleware = worker => {
  /*
    for now, we don't really care if you actually pass it a Worker instance; as long as
    it look likes a Worker and works like a Worker (has a `postMessage` method), it _is_ a Worker.
    The reason behind is that we want to support WebWorker shims in an easy manner,
    although shimming it doesn't make a lot of sense.
  */

  if (!worker) {
    throw new Error(
      `\`createWorkerMiddleware\` expects a worker instance as the argument. Instead received: ${worker}`
    );
  } else if (!worker.postMessage) {
    throw new Error('The worker instance is expected to have a `postMessage` method.');
  }

  return ({ dispatch }) => {
    /*
      when the worker posts a message back, dispatch the action with its payload
      so that it will go through the entire middleware chain
    */
    // eslint-disable-next-line no-param-reassign
    worker.onmessage = ({ data: resultActionString }) => {
      // console.log(Date.now())
      // console.log(resultActionString.length)
      // Perf.start()
      dispatch(JSON.parse(resultActionString));
      // Perf.stop()
      // const measurements = Perf.getLastMeasurements()
      // Perf.printInclusive(measurements)
      // console.log(Date.now())
      // console.log('----')
    };

    return next => {
      if (!next) {
        throw new Error('Worker middleware received no `next` action. Check your chain of middlewares.');
      }

      return action => {
        if (action.meta && action.meta.WebWorker) {
          // console.log('----')
          // console.log(Date.now())
          // console.log(JSON.stringify(action).length)
          worker.postMessage(JSON.stringify(action));
        }
        // always pass the action along to the next middleware
        return next(action);
      };
    };
  };
};

export default createWorkerMiddleware;
