const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * Handle creating/removing shortcuts on Windows when
 * installing/uninstalling
 */
if (require('electron-squirrel-startup')) {
  app.quit();
}

/**
 * Keep a global reference of the window object, if you don't,
 * the window will be closed automatically when the JavaScript object
 * is garbage collected
 */
let mainWindow, childWindow;

/**
 * Create main window
 */
const createWindow = () => {

  /* Create the main browser window */
  mainWindow = new BrowserWindow({
    maxWidth: 500,
    maxHeight: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  /* Create the child browser window */
  childWindow = new BrowserWindow({
    maxWidth: 500,
    maxHeight: 400,
    x: 2*mainWindow.getPosition()[0],
    y: mainWindow.getPosition()[1],
    webPreferences: {
      nodeIntegration: true
    },
    parent: mainWindow
  })

  /* Load the index page of the app */
  mainWindow.loadFile(path.join(__dirname, './ui/index.html'));

  /* Emitted when the main window is closed */
  mainWindow.on('closed', () => {
    /**
     * Dereference the window object, usually you would store windows
     * in an array if your app supports multi windows, this is the time
     * when you should delete the corresponding element.
     */
    mainWindow = null;
  });

  /* Emitted when the child window is closed */
  childWindow.on('closed', () => {
    /**
     * Dereference the window object, usually you would store windows
     * in an array if your app supports multi windows, this is the time
     * when you should delete the corresponding element.
     */
    childWindow = null;
  });
  
  
  /* Emitted when the main window is moved */
  mainWindow.on('move', () => {
    /**
     * Get the position of the parent window
     * and move the child window accordingly.
     */
    let positions = mainWindow.getPosition();
    childWindow.setPosition(mainWindow.getSize()[0] + positions[0], positions[1]);
  });

};

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows,
 * Some APIs can only be used after this event occurs
 */
app.on('ready', createWindow);

/**
 * Quit when all windows are closed.
 */
app.on('window-all-closed', () => {
  /* On OS X it is common for applications and their menu bar
    to stay active until the user quits explicitly with Cmd + Q */
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  /* On OS X it's common to re-create a window in the app when the
     dock icon is clicked and there are no other windows open */
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
