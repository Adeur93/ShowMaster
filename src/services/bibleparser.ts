import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import Database from 'better-sqlite3';

export function importZefaniaBible(xmlFilePath: string, dbPath: string) {
  const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
  const db = new Database(dbPath);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  
  const parsed = parser.parse(xmlData);
  const bibleRoot = parsed.xmlbible || parsed.BIBLE;
  const bibleName = bibleRoot['@_biblename'] || 'Biblia Importada';

  // Inserción de la biblia
  const insertBible = db.prepare('INSERT INTO bibles (name, language) VALUES (?, ?)');
  const info = insertBible.run(bibleName, bibleRoot['@_language'] || 'es');
  const bibleId = info.lastInsertRowid;

  const insertVerse = db.prepare(
    'INSERT INTO bible_verses (bible_id, book_name, chapter, verse, text) VALUES (?, ?, ?, ?, ?)'
  );

  const insertMany = db.transaction((books) => {
    for (const book of books) {
      const bookName = book['@_bname'] || book['@_bsname'];
      const chapters = Array.isArray(book.CHAPTER) ? book.CHAPTER : [book.CHAPTER];

      for (const chapter of chapters) {
        const chapNum = parseInt(chapter['@_cnumber'], 10);
        const verses = Array.isArray(chapter.VERS) ? chapter.VERS : [chapter.VERS];

        for (const verse of verses) {
          const verseNum = parseInt(verse['@_vnumber'], 10);
          const verseText = typeof verse === 'object' ? verse['#text'] : verse;
          insertVerse.run(bibleId, bookName, chapNum, verseNum, verseText);
        }
      }
    }
  });

  const books = Array.isArray(bibleRoot.BIBLEBOOK) ? bibleRoot.BIBLEBOOK : [bibleRoot.BIBLEBOOK];
  insertMany(books);
  db.close();
}