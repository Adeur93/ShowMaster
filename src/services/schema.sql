-- Canciones y Letras
CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    content_json TEXT NOT NULL -- Estructura JSON con estrofas y coros
);

-- Medios (Imágenes, Vídeos, Audios)
CREATE TABLE IF NOT EXISTS media_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    media_type TEXT CHECK(media_type IN ('image', 'video', 'audio')),
    category TEXT
);

-- Guiones de Servicio / Schedules
CREATE TABLE IF NOT EXISTS service_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT,
    items_json TEXT NOT NULL -- Orden de elementos (canción, versículo, medio)
);

-- Biblias
CREATE TABLE IF NOT EXISTS bibles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    language TEXT
);

CREATE TABLE IF NOT EXISTS bible_verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bible_id INTEGER,
    book_name TEXT,
    chapter INTEGER,
    verse INTEGER,
    text TEXT,
    FOREIGN KEY(bible_id) REFERENCES bibles(id)
);
CREATE INDEX idx_bible_lookup ON bible_verses(bible_id, book_name, chapter, verse);