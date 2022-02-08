const { app, BrowserWindow, ipcMain, shell, screen } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
    let display = screen.getPrimaryDisplay();
    let width = display.bounds.width;

    mainWindow = new BrowserWindow({
        width: 360,
        height: 600,
        x: width - 360,
        y: 0,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: isDev,
            webSecurity: false,
            preload: path.join(__dirname, "preload.js")
        },
    });

    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: "detach" });
    }

    mainWindow.setResizable(true);
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.focus();
}

app.on("ready", createWindow);

app.whenReady().then(() => {
    ipcMain.on("openArticle", (_, uri) => {
        shell.openExternal(uri);
    });
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});