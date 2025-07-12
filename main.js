const { app, BrowserWindow } = require('electron');
const path = require('path');

// Function to create the main application window
function createWindow () {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // Enable Node.js integration
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the index.html of the app
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Optionally open DevTools in development
  // mainWindow.webContents.openDevTools();
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Re-create a window when the app is activated (macOS)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
