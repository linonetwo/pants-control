import createWorkerMiddleware from './redux-worker-middleware';

import SearchWorker from './search.worker';

const workerMiddleware = createWorkerMiddleware(new SearchWorker());
export default workerMiddleware;
