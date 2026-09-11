const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setAlwaysOnTop: (enabled) => ipcRenderer.send('set-always-on-top', enabled),
});