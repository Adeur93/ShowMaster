// Tipos para los payloads y respuestas
export type ProjectionPayload = {
  type: 'text' | 'video' | 'image' | 'bible';
  content?: string;
  src?: string;
  styles?: Record<string, string | number>;
};

export interface DbResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Extender la interfaz Window del navegador
declare global {
  interface Window {
    controlApi: {
      projectContent: (payload: ProjectionPayload) => void;
      clearScreen: () => void;
      getBibleVerse: (translation: string, book: string, chapter: number, verse: number) => Promise<DbResponse<{text: string}>>;
      getMediaList: () => Promise<DbResponse<any[]>>;
      addMedia: (name: string, type: string, filePath: string) => Promise<DbResponse<any>>;
    };
    
    projectorApi: {
      onUpdateScreen: (callback: (payload: ProjectionPayload) => void) => void;
      onClearScreen: (callback: () => void) => void;
    };
  }
}