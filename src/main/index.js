import { app, BrowserWindow, shell, Menu } from "electron";
import locales from "./locales";

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\");
}

let mainWindow;
let menu;
const winURL = process.env.NODE_ENV === "development" ? `http://localhost:9080` : `file://${__dirname}/index.html`;
const locale = app.getLocale() || "zh-CN";
const i18n = locales[locale];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 520,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(winURL);

  const templates = [
    {
      label: i18n.Edit,
      submenu: [
        {
          label: i18n.Preference,
          accelerator: "Cmd+,",
          click: () => {
            mainWindow.webContents.send("click-menu-preference");
          },
        },
        {
          label: i18n.Save,
          accelerator: "CmdOrCtrl+S",
          click: () => {
            mainWindow.webContents.send("click-menu-save");
          },
        },
        { type: "separator" },
        { role: "undo", label: i18n.Undo },
        { role: "redo", label: i18n.Redo },
        { type: "separator" },
        { role: "cut", label: i18n.Cut },
        { role: "copy", label: i18n.Copy },
        { role: "paste", label: i18n.Paste },
        { role: "delete", label: i18n.Delete },
        { role: "selectall", label: i18n.SelectAll },
        { role: "toggledevtools", label: i18n.ToggleDevTools },
        { type: "separator" },
        { role: "close", label: i18n.Close },
        { role: "quit", label: i18n.Quit },
      ],
    },
    {
      role: "windowMenu",
    },
    {
      role: i18n.Help,
      submenu: [
        {
          label: "Learn More",
          click() {
            shell.openExternal("https://github.com/rmlzy/kis-desktop");
          },
        },
      ],
    },
  ];
  menu = Menu.buildFromTemplate(templates);
  Menu.setApplicationMenu(menu);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
