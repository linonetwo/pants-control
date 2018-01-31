const { app } = require('electron');
const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');

const createWindow = require('./createWindow');

/* Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected. */
let appWindow;
let apiWindow;
const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

app.on('ready', () => {
  appWindow = createWindow('app', startUrl);
  if (isDev) appWindow.webContents.openDevTools();
  apiWindow = createWindow('api', startUrl, true);
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log(appWindow);
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (appWindow === null) {
    appWindow = createWindow('app', startUrl);
  } else {
    appWindow.showURL(startUrl);
  }
  if (apiWindow === null) {
    apiWindow = createWindow('api', startUrl, true);
  }
});
