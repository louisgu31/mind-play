import { app, BrowserWindow, ipcMain } from 'electron';
import pkg from 'electron-updater';
import path from 'path';
import { fileURLToPath } from 'url';

const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'hiddenInset'
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function sendStatusToWindow(text, data = {}) {
  if (mainWindow) {
    mainWindow.webContents.send('update-message', { message: text, ...data });
  }
}

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Disable code signature verification for non-signed apps
autoUpdater.verifyUpdateCodeSignatures = false;

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('update-available', { version: info.version, releaseNotes: info.releaseNotes });
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('update-not-available', { version: info.version });
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('update-error', { error: err.message });
});

autoUpdater.on('download-progress', (progressObj) => {
  sendStatusToWindow('download-progress', {
    percent: progressObj.percent,
    bytesPerSecond: progressObj.bytesPerSecond,
    total: progressObj.total,
    transferred: progressObj.transferred
  });
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('update-downloaded', { version: info.version });
});

ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return { success: true, updateInfo: result?.updateInfo };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('install-update', async () => {
  autoUpdater.quitAndInstall();
  return { success: true };
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

app.whenReady().then(() => {
  createWindow();
  
  if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
