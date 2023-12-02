const { app, BrowserWindow, session } = require('electron');
const { pathToFileURL } = require('url');
const path = require('path');
const serve = require('electron-serve');
require('dotenv').config();

/**
 * Config
 */
const outputPath = parseInt(process.env.PRODUCTION.toString()) == 0 ? 'development' : 'production';
const serveInstance = serve({
  directory: path.join(__dirname, `../.output/${outputPath}/app/files/public`),
  hostname: 'odin/app',
  scheme: 'app',
});

/**
 * Create function to run website in SSR
 */
const startDevelopmentInstance = async () => {
  const modulePath = path.join(__dirname, '../.output/development/website/server/index.mjs');
  const moduleUrl = pathToFileURL(modulePath).href;
  const { default: startServer } = await import(moduleUrl);

  if (typeof startServer === 'function') {
    await startServer();
  }
};

/**
 * Create function to create window
 */
const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      allowRunningInsecureContent: false,
    },
    show: false,
  });

  win.center();
  return win;
};

/**
 * Create function when app is ready
 */
let application = null;

(async () => {
  await app.whenReady();

  application = await createWindow();

  application.maximize();
  application.show();
  application.setMenu(null);
  application.setFullScreen(false);
  serveInstance(application);

  if (outputPath === 'development') {
    startDevelopmentInstance();
    application.on("ready-to-show", () => {
      application.webContents.openDevTools();
    });
  }
})();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
