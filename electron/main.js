import { app, BrowserWindow, ipcMain } from 'electron';
import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import extractZip from 'extract-zip';

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

const REPO_OWNER = 'louisgu31';
const REPO_NAME = 'mind-play';
const currentVersion = app.getVersion();

function getLatestRelease() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
      headers: { 'User-Agent': 'MindPlay-App' }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath, onProgress) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: { 'User-Agent': 'MindPlay-App', 'Accept': 'application/octet-stream' }
    };

    https.get(options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        downloadFile(response.headers.location, destPath, onProgress)
          .then(resolve).catch(reject);
        return;
      }
      if (response.statusCode >= 400) {
        file.close();
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        if (onProgress && totalSize) {
          onProgress((downloaded / totalSize) * 100, downloaded, totalSize);
        }
      });

      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(destPath); });
      file.on('error', reject);
    }).on('error', (err) => { file.close(); reject(err); });
  });
}

function getAppAsarPath() {
  const appDir = path.dirname(path.dirname(process.execPath));
  return path.join(appDir, 'Resources', 'app.asar');
}

async function performAsarUpdate(zipPath) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mindplay-update-'));
  const appAsarPath = getAppAsarPath();
  
  try {
    sendStatusToWindow('update-progress', { percent: 90, status: 'Extracting update...' });
    
    await extractZip(zipPath, { dir: tempDir });
    
    const extractedAppAsar = path.join(tempDir, 'MindPlay.app', 'Contents', 'Resources', 'app.asar');
    
    if (!fs.existsSync(extractedAppAsar)) {
      throw new Error('app.asar not found in update package');
    }
    
    const backupPath = appAsarPath + '.backup';
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
    fs.copyFileSync(appAsarPath, backupPath);
    
    sendStatusToWindow('update-progress', { percent: 95, status: 'Installing update...' });
    
    fs.copyFileSync(extractedAppAsar, appAsarPath);
    
    return true;
  } catch (err) {
    const backupPath = appAsarPath + '.backup';
    if (fs.existsSync(backupPath)) {
      try { fs.copyFileSync(backupPath, appAsarPath); } catch (e) {}
    }
    throw err;
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

function restartApp() {
  const appPath = process.execPath;
  const args = process.argv.slice(1);
  
  const child = spawn(appPath, args, {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();
  app.quit();
}

let cachedReleaseInfo = null;

ipcMain.handle('check-for-updates', async () => {
  try {
    sendStatusToWindow('Checking for update...');
    const release = await getLatestRelease();
    
    if (release.tag_name) {
      const latestVersion = release.tag_name.replace(/^v/, '');
      const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;
      
      cachedReleaseInfo = release;
      
      if (hasUpdate) {
        const zipAsset = release.assets?.find(a => a.name.includes('-mac.zip'));
        sendStatusToWindow('update-available', { 
          version: latestVersion, 
          releaseNotes: release.body,
          downloadUrl: zipAsset?.browser_download_url
        });
        return { 
          success: true, 
          updateAvailable: true, 
          version: latestVersion,
          releaseNotes: release.body,
          downloadUrl: zipAsset?.browser_download_url
        };
      } else {
        sendStatusToWindow('update-not-available', { version: latestVersion });
        return { success: true, updateAvailable: false, version: latestVersion };
      }
    }
    return { success: false, error: 'Could not determine latest version' };
  } catch (error) {
    sendStatusToWindow('update-error', { error: error.message });
    return { success: false, error: error.message };
  }
});

ipcMain.handle('download-update', async () => {
  try {
    if (!cachedReleaseInfo) {
      const release = await getLatestRelease();
      cachedReleaseInfo = release;
    }
    
    const zipAsset = cachedReleaseInfo.assets?.find(a => a.name.includes('-mac.zip'));
    if (!zipAsset) {
      throw new Error('No update package found');
    }
    
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mindplay-download-'));
    const zipPath = path.join(tempDir, zipAsset.name);
    
    sendStatusToWindow('download-progress', {
      percent: 0,
      bytesPerSecond: 0,
      total: zipAsset.size,
      transferred: 0
    });
    
    await downloadFile(
      zipAsset.browser_download_url, 
      zipPath,
      (percent, transferred, total) => {
        sendStatusToWindow('download-progress', {
          percent,
          bytesPerSecond: 0,
          total,
          transferred
        });
      }
    );
    
    sendStatusToWindow('update-progress', { percent: 85, status: 'Preparing update...' });
    
    await performAsarUpdate(zipPath);
    
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
    
    sendStatusToWindow('update-downloaded', { version: cachedReleaseInfo.tag_name.replace(/^v/, '') });
    return { success: true };
  } catch (error) {
    sendStatusToWindow('update-error', { error: error.message });
    return { success: false, error: error.message };
  }
});

ipcMain.handle('install-update', async () => {
  restartApp();
  return { success: true };
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

function compareVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const valA = partsA[i] || 0;
    const valB = partsB[i] || 0;
    if (valA > valB) return 1;
    if (valA < valB) return -1;
  }
  return 0;
}

app.whenReady().then(() => {
  createWindow();
  
  if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
    setTimeout(async () => {
      try {
        const release = await getLatestRelease();
        if (release.tag_name) {
          const latestVersion = release.tag_name.replace(/^v/, '');
          if (compareVersions(latestVersion, currentVersion) > 0) {
            const zipAsset = release.assets?.find(a => a.name.includes('-mac.zip'));
            cachedReleaseInfo = release;
            sendStatusToWindow('update-available', { 
              version: latestVersion, 
              releaseNotes: release.body,
              downloadUrl: zipAsset?.browser_download_url
            });
          }
        }
      } catch (e) {
        console.error('Update check failed:', e.message);
      }
    }, 3000);
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
