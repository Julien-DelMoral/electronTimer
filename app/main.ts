import { app, BrowserWindow, screen, ipcMain, Notification } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let win: BrowserWindow = null;
let pathAssets = path.join(__dirname, './assets');

app.disableHardwareAcceleration()

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  win = new BrowserWindow({
    icon: "./src/assets/timer.png",
    width: 450,
    height: 520,
    backgroundColor: '#ffffff',
    resizable: false,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false
    },
  });

  //win.webContents.openDevTools()

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
    pathAssets = path.join(__dirname, '../src/assets')
  }
  else {
    // Path when running electron executable
    let pathIndex = './index.html';
    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
      pathAssets = path.join(__dirname, '../src/assets')
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  win.on('closed', () => {
    win = null;
  });
  return win;
}

try {

  app.on('ready', () => setTimeout(createWindow, 400));
  app.setAppUserModelId("ElectronTimer");

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });


  ipcMain.on('notify', (event, notification) => {
    console.log("notify event raised by angular")
    console.log('assets : ' + pathAssets)


    const NOTIFICATION_ICON = path.join(pathAssets, 'timer-70.png')

    const notify = new Notification({ title: notification.title, body: notification.message, icon: NOTIFICATION_ICON })

    notify.on('click', () => {
      console.log("click callback")
      win.show();
    }).show()
  });

  ipcMain.on('closeMainWindow',() =>{
    win.close()
  });

  ipcMain.on('minimizeMainWindow',() =>{
    win.minimize()
  });


} catch (e) {
  // Catch Error
  // throw e;
}
