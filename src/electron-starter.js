const { app } = require('electron');
const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');

const createWindow = require('./createWindow');
const sha512 = require('hash.js/lib/hash/sha/512');

const { initIPFSD, killIPFSD } = require('./store/backend/ipfs/ipfsd');

/* Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected. */
let appWindow;
let apiWindow;
const signature = sha512()
  .update(String(new Date()))
  .digest('hex');

const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

app.on('ready', async () => {
  try {
    const { addresses } = await initIPFSD();
    appWindow = createWindow('app', startUrl, { signature, addresses });
    apiWindow = createWindow('api', startUrl, { signature, addresses }, true);
    if (isDev) {
      appWindow.webContents.openDevTools();
      apiWindow.webContents.openDevTools();
    }
  } catch (error) {
    console.error(error);
  }
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    killIPFSD();
    app.quit();
  }
});

app.on('activate', () => {
  console.log(appWindow);
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!appWindow) {
    appWindow = createWindow('app', startUrl, { signature });
  } else {
    appWindow.showURL(startUrl);
  }
  if (apiWindow === null) {
    apiWindow = createWindow('api', startUrl, { signature }, true);
  }
});
