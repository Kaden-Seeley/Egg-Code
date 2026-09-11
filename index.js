const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        width: 300,
        height: 450,
        icon: path.join(__dirname, 'assets', 'Logo.ico'),
    })

    win.loadFile('index.html')

    win.setMenuBarVisibility(false)
}

ipcMain.on('set-always-on-top', (event, enabled) => {
    BrowserWindow.fromWebContents(event.sender)?.setAlwaysOnTop(Boolean(enabled));
});

app.whenReady().then(() => {
    createWindow()
})

