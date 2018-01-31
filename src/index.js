import isRenderer from 'is-electron-renderer';

const initRenderer = async () => {
  if (!isRenderer) return import('./App');
  const { parseArgs } = await import('electron-window');
  parseArgs();
  // eslint-disable-next-line no-underscore-dangle
  console.log(window.__args__)
  const { task } = window.__args__;
  switch (task) {
    case 'api':
      return import('./api');
    case 'app':
    default:
      return import('./App');
  }
};

initRenderer();
