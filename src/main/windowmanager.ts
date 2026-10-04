import { BrowserWindow, screen, app } from 'electron';
import path from 'path';

declare const APP_RENDERER_VITE_DEV_SERVER_URL: string;
declare const APP_RENDERER_VITE_NAME: string;

export class WindowManager {
  public controlWindow: BrowserWindow | null = null;
  public projectorWindow: BrowserWindow | null = null;

  public createWindows() {
    this.createControlWindow();
    this.createProjectorWindow();
  }

  private createControlWindow() {
    this.controlWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 900,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, '../preload/controlpreload.js'),
        contextIsolation: true,
      },
    });

    this.loadURL(this.controlWindow, 'control');
    this.controlWindow.on('closed', () => {
      app.quit(); // Cerrar toda la app si se cierra el control
    });
  }

  private createProjectorWindow() {
    // 1. Obtener todas las pantallas
    const displays = screen.getAllDisplays();
    
    // 2. Buscar monitor externo (el que no está en las coordenadas 0,0)
    const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    // 3. Configurar ventana de proyección
    this.projectorWindow = new BrowserWindow({
      x: externalDisplay ? externalDisplay.bounds.x : 0,
      y: externalDisplay ? externalDisplay.bounds.y : 0,
      width: 1280,
      height: 720,
      fullscreen: !!externalDisplay, // Pantalla completa solo si hay monitor externo
      frame: false,
      skipTaskbar: true,
      backgroundColor: '#000000', // Fondo negro por defecto
      webPreferences: {
        preload: path.join(__dirname, '../preload/projectorpreload.js'),
        contextIsolation: true,
        webSecurity: false // Permite cargar videos locales con protocolo file://
      },
    });

    this.loadURL(this.projectorWindow, 'projector');
  }

  // Utilidad para enviar estado a la pantalla desde cualquier parte
  public sendToProjector(channel: string, payload: any) {
    if (this.projectorWindow && !this.projectorWindow.isDestroyed()) {
      this.projectorWindow.webContents.send(channel, payload);
    }
  }

  private loadURL(window: BrowserWindow, entryName: 'control' | 'projector') {
    if (APP_RENDERER_VITE_DEV_SERVER_URL) {
      window.loadURL(`${APP_RENDERER_VITE_DEV_SERVER_URL}/src/renderer/${entryName}/index.html`);
    } else {
      window.loadFile(path.join(__dirname, `../renderer/${APP_RENDERER_VITE_NAME}/src/renderer/${entryName}/index.html`));
    }
  }
}