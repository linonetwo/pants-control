const { createWindow } = require('electron-window');
const windowStateKeeper = require('electron-window-state');
const isDev = require('electron-is-dev');

/** @param {Object} title - 在 renderer 进程里能取到的参数 */
module.exports = (task, startUrl, args, hidden = false, windowStateOpts = {}, browserWindowOpts = {}) => {
  const windowState = windowStateKeeper(Object.assign(
    {
      defaultWidth: 1000,
      defaultHeight: 800,
    },
    windowStateOpts,
  ));
  const window = createWindow(Object.assign(
    {
      x: windowState.x,
      y: windowState.y,
      width: windowState.width,
      height: windowState.height,
      minWidth: 900,
      minHeight: 620,
      preload: true,
    },
    browserWindowOpts,
  ));

  windowState.manage(window);

  if (!hidden || isDev) {
    window.showUrl(startUrl, Object.assign({ task }, args), () => {
      console.log(`${task} is now visible!`);
    });
  } else {
    window._loadURLWithArgs(startUrl, Object.assign({ task }, args), () => {
      console.log(`${task} is running in the background!`);
    });
  }

  return window;
};
