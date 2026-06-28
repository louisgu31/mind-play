import { app, BrowserWindow, ipcMain } from 'electron';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

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

// Custom update mechanism for unsigned apps
const REPO_OWNER = 'louisgu31';
const REPO_NAME = 'mind-play';

function getLatestRelease() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
      headers: {
        'User-Agent': 'MindPlay-App'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
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
      path: parsedUrl.pathname,
      headers: {
        'User-Agent': 'MindPlay-App'
      }
    };

    https.get(options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, destPath, onProgress)
          .then(resolve)
          .catch(reject);
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        if (onProgress && totalSize) {
          onProgress(downloaded, totalSize);
        }
      });

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
      
      file.on('error', reject);
    }).on('error', reject);
  });
}

function extractAndReplaceAsar(zipPath) {
  return new Promise((resolve, reject) => {
    const appDir = path.dirname(path.dirname(process.execPath));
    const resourcesDir = path.join(appDir, 'Resources');
    const appAsarPath = path.join(resourcesDir, 'app.asar');
    const backupPath = path.join(resourcesDir, 'app.asar.backup');

    console.log('App directory:', appDir);
    console.log('Resources dir:', resourcesDir);
    console.log('Current app.asar:', appAsarPath);
    console.log('ZIP path:', zipPath);

    // For now, let's just indicate this is a placeholder
    // In production, we'd extract app.asar from the zip and replace
    reject(new Error('Full app.asar replacement not implemented - use DMG installer for updates'));
  });
}

let currentVersion = app.getVersion();

ipcMain.handle('check-for-updates', async () => {
  try {
    sendStatusToWindow('Checking for update...');
    const release = await getLatestRelease();
    
    if (release.tag_name) {
      const latestVersion = release.tag_name.replace(/^v/, '');
      const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;
      
      if (hasUpdate) {
        sendStatusToWindow('update-available', { 
          version: latestVersion, 
          releaseNotes: release.body 
        });
        return { 
          success: true, 
          updateAvailable: true, 
          version: latestVersion,
          releaseNotes: release.body,
          downloadUrl: release.html_url
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
    sendStatusToWindow('update-error', { 
      error: 'Please download the update manually from GitHub. Code-signed auto-updates require an Apple Developer certificate.' 
    });
    return { 
      success: false, 
      error: 'Auto-update requires code signing. Please download manually from GitHub.',
      manualDownload: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('install-update', async () => {
  // Open the releases page for manual download
  exec(`open "https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest"`);
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
    // Check for updates on startup (informational only)
    setTimeout(async () => {
      try {
        const release = await getLatestRelease();
        if (release.tag_name) {
          const latestVersion = release.tag_name.replace(/^v/, '');
          if (compareVersions(latestVersion, currentVersion) > 0) {
            sendStatusToWindow('update-available', { 
              version: latestVersion, 
              releaseNotes: release.body 
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
