// src/main.ts
import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'path';

// Declaración de las variables inyectadas por Electron Forge
declare const APP_RENDERER_VITE_DEV_SERVER_URL: string;
declare const APP_RENDERER_VITE_NAME: string;

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
      preload: path.join(__dirname, '../preload/controlpreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

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
      preload: path.join(__dirname, '../preload/projectorPreload.js'),
      contextIsolation: true,
    },
  });
  // 3. Enrutamiento Inteligente (Desarrollo vs Producción)
  if (APP_RENDERER_VITE_DEV_SERVER_URL) {
    // ESTAMOS EN DESARROLLO (Vite enciende un localhost)
    controlWindow.loadURL(`${APP_RENDERER_VITE_DEV_SERVER_URL}/src/renderer/control/index.html`);
    outputWindow.loadURL(`${APP_RENDERER_VITE_DEV_SERVER_URL}/src/renderer/projector/index.html`);
    // Opcional: Abrir herramientas de desarrollador
    controlWindow.webContents.openDevTools();
  } else {
    // ESTAMOS EN PRODUCCIÓN (Archivos minificados locales)
    controlWindow.loadFile(
      path.join(__dirname, `../renderer/${APP_RENDERER_VITE_NAME}/src/renderer/control/index.html`)
    );
    outputWindow.loadFile(
      path.join(__dirname, `../renderer/${APP_RENDERER_VITE_NAME}/src/renderer/projector/index.html`)
    );
  }
}

// IPC: Retransmitir cambios de la Ventana de Control a la Ventana de Proyección
ipcMain.on('PROJECT_SLIDE', (_event, slideData) => {
  if (outputWindow && !outputWindow.isDestroyed()) {
    outputWindow.webContents.send('RENDER_SLIDE', slideData);
  }
});

app.whenReady().then(createWindows);