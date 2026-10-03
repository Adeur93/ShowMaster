// src/main.ts
import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'path';

let controlWindow: BrowserWindow | null = null;
let outputWindow: BrowserWindow | null = null;

function createWindows() {
  const displays = screen.getAllDisplays();
  // Si hay más de un monitor, asignamos el segundo para proyección; de lo contrario, usaremos el principal
  const externalDisplay = displays.find((display) => display.bounds.x !== 0 || display.bounds.y !== 0) || displays[0];

  // 1. Ventana de Control
  controlWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  controlWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL || `file://${path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)}`);

  // 2. Ventana de Proyección (Pantalla Completa en Display Secundario)
  outputWindow = new BrowserWindow({
    x: externalDisplay.bounds.x,
    y: externalDisplay.bounds.y,
    width: externalDisplay.bounds.width,
    height: externalDisplay.bounds.height,
    fullscreen: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  
  // Cargar vista de salida
  outputWindow.loadURL((MAIN_WINDOW_VITE_DEV_SERVER_URL || `file://${path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)}`) + '#/output');
}

// IPC: Retransmitir cambios de la Ventana de Control a la Ventana de Proyección
ipcMain.on('PROJECT_SLIDE', (_event, slideData) => {
  if (outputWindow && !outputWindow.isDestroyed()) {
    outputWindow.webContents.send('RENDER_SLIDE', slideData);
  }
});

app.whenReady().then(createWindows);