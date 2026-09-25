const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

if (process.platform === 'linux' && process.env.WAYLAND_DISPLAY && process.env.DISPLAY) {
    app.commandLine.appendSwitch('ozone-platform', 'x11');
}

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
        minWidth: 280,
        minHeight: 420,
        icon: path.join(__dirname, 'assets', 'Egg_In_Pan.png'),
    })

    win.loadFile(path.join(__dirname, 'index.html'))

    win.setMenuBarVisibility(false)
}

ipcMain.on('set-always-on-top', (event, enabled) => {
    BrowserWindow.fromWebContents(event.sender)?.setAlwaysOnTop(Boolean(enabled));
});

app.whenReady().then(() => {
    createWindow()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

