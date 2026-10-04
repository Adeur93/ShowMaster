import { ipcMain } from 'electron';
import { WindowManager } from './windowmanager';
import { DbService } from './database';

export function setupIpcHandlers(windowManager: WindowManager, dbService: DbService) {
  
  // 1. GESTIÓN DE PROYECCIÓN (Control -> Main -> Projector)
  ipcMain.on('project-content', (event, payload) => {
    /* 
      payload esperado:
      { type: 'text', content: 'Cantaré de tu amor', styles: { fontSize: '6vw' } } o
      { type: 'video', src: 'file:///C:/videos/fondo.mp4' }
    */
    windowManager.sendToProjector('update-screen', payload);
  });

  ipcMain.on('clear-screen', () => {
    windowManager.sendToProjector('clear-screen', null);
  });

  // 2. CONSULTAS A BASE DE DATOS (Control <-> Main)
  // Usamos handle() en lugar de on() para poder devolver un valor al frontend
  ipcMain.handle('get-bible-verse', (event, args) => {
    const { translation, book, chapter, verse } = args;
    try {
      const result = dbService.getVerse(translation, book, chapter, verse);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('get-media-list', () => {
    const db = dbService.getDb();
    const media = db.prepare('SELECT * FROM Media').all();
    return { success: true, data: media };
  });

  // 3. EJEMPLO: GUARDAR NUEVO MEDIO
  ipcMain.handle('add-media', (event, args) => {
    const { name, type, filePath } = args;
    const db = dbService.getDb();
    const stmt = db.prepare('INSERT INTO Media (name, type, filePath) VALUES (?, ?, ?)');
    const info = stmt.run(name, type, filePath);
    return { success: true, id: info.lastInsertRowid };
  });
}