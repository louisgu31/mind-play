const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  console.log('MindPlay app loaded');
});

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onUpdateMessage: (callback) => {
    ipcRenderer.on('update-message', (_event, data) => callback(data));
  },
  removeUpdateListener: () => {
    ipcRenderer.removeAllListeners('update-message');
  }
});
