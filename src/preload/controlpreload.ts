import { contextBridge, ipcRenderer } from 'electron';

// Definimos el objeto que se inyectará en window.controlApi
const controlApi = {
  // --- COMANDOS DE PROYECCIÓN ---
  projectContent: (payload: any) => {
    ipcRenderer.send('project-content', payload);
  },
  clearScreen: () => {
    ipcRenderer.send('clear-screen');
  },

  // --- CONSULTAS A BASE DE DATOS (Promesas) ---
  getBibleVerse: async (translation: string, book: string, chapter: number, verse: number) => {
    // ipcRenderer.invoke devuelve una Promesa y espera el return del main process
    return await ipcRenderer.invoke('get-bible-verse', { translation, book, chapter, verse });
  },
  
  getMediaList: async () => {
    return await ipcRenderer.invoke('get-media-list');
  },

  addMedia: async (name: string, type: 'video' | 'image', filePath: string) => {
    return await ipcRenderer.invoke('add-media', { name, type, filePath });
  }
};

// Inyectar en el objeto global de forma segura
contextBridge.exposeInMainWorld('controlApi', controlApi);