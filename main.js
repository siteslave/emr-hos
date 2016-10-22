const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const ipcMain = electron.ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1124,
    height: 780,
    frame: true,
    resizable : false
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/templates/login.html`)

  console.log(app.getLocale())  
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.setMenu(null);  
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.on('show-debug', (event, arg) => {
    mainWindow.webContents.openDevTools();
    event.returnValue = null;
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
