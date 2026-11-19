// The small bridge between the app's own pages (first start, server settings, download status) and the app process.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('rpgDesktop', {
  save: (v) => ipcRenderer.invoke('setup:save', v),
  status: () => ipcRenderer.invoke('status:get'),
  retry: () => ipcRenderer.invoke('status:retry'),
  onStatus: (fn) => ipcRenderer.on('status', (_e, s) => fn(s)),
});
