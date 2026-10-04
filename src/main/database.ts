import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

export class DbService {
  private db: Database.Database;

  constructor() {
    // Definir ruta segura para la base de datos en producción
    const dbPath = path.join(app.getPath('userData'), 'proyektor_data.sqlite');
    
    // Iniciar conexión sincrónica
    this.db = new Database(dbPath, { verbose: console.log });
    this.initializeSchema();
  }

  private initializeSchema() {
    // Transacción para crear tablas rápidamente si no existen
    const init = this.db.transaction(() => {
      this.db.prepare(`
        CREATE TABLE IF NOT EXISTS Media (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL, -- 'video', 'image'
          filePath TEXT NOT NULL,
          thumbnailPath TEXT
        )
      `).run();

      this.db.prepare(`
        CREATE TABLE IF NOT EXISTS Bibles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          translation TEXT NOT NULL,
          book TEXT NOT NULL,
          chapter INTEGER NOT NULL,
          verse INTEGER NOT NULL,
          text TEXT NOT NULL
        )
      `).run();

      this.db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_bible_search 
        ON Bibles(translation, book, chapter, verse)
      `).run();
    });

    init();
  }

  // Ejemplo de método para consultar
  public getVerse(translation: string, book: string, chapter: number, verse: number) {
    const stmt = this.db.prepare(
      'SELECT text FROM Bibles WHERE translation = ? AND book = ? AND chapter = ? AND verse = ?'
    );
    return stmt.get(translation, book, chapter, verse);
  }

  // Expone la instancia para consultas avanzadas
  public getDb() {
    return this.db;
  }
}