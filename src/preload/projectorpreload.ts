import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const projectorApi = {
  // Registra un callback que el frontend ejecutará cuando llegue contenido
  onUpdateScreen: (callback: (payload: any) => void) => {
    // Es importante eliminar listeners previos si el componente de React/Vue se remonta
    ipcRenderer.removeAllListeners('update-screen');
    ipcRenderer.on('update-screen', (_event: IpcRendererEvent, payload: any) => {
      callback(payload);
    });
  },

  // Registra un callback para limpiar la pantalla
  onClearScreen: (callback: () => void) => {
    ipcRenderer.removeAllListeners('clear-screen');
    ipcRenderer.on('clear-screen', () => {
      callback();
    });
  }
};

contextBridge.exposeInMainWorld('projectorApi', projectorApi);