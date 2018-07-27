// @flow
const initRenderer = async () => {
  // If not started in electron, just open App
  if (!window.__args__) return import('./App');
  const { task } = window.__args__;
  switch (task) {
    // If it's in renderer process, and task is API, open server
    case 'api':
      return import('./api');
    case 'app':
    default:
      return import('./App');
  }
};
initRenderer();
