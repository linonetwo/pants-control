import createWorkerMiddleware from './redux-worker-middleware';

import NLPWorker from './nlp.worker';

const workerMiddleware = createWorkerMiddleware(new NLPWorker());
export default workerMiddleware;
