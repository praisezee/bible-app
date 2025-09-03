import fs from 'fs';
import fetch from 'node-fetch';

// Books of the Bible in order
const books = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Solomon',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation',
];

// Detect testament
function getTestament(book) {
  const oldTestament = new Set(books.slice(0, 39));
  return oldTestament.has(book) ? 'old' : 'new';
}

// Delay helper
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch chapter data
async function fetchChapter(book, chapter) {
  const url = `https://bible-api.com/${encodeURIComponent(
    book + ' ' + chapter
  )}?translation=kjv`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ Failed ${book} ${chapter} (HTTP ${res.status})`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`⚠️ Error fetching ${book} ${chapter}:`, err.message);
    return null;
  }
}

// Build Bible JSON
async function buildBible() {
  const bible = { version: 'King James Version', books: [] };

  for (const book of books) {
    console.log(`📖 Processing ${book}...`);
    const bookData = {
      name: book,
      testament: getTestament(book),
      chapters: [],
    };

    let chapter = 1;
    while (true) {
      const data = await fetchChapter(book, chapter);
      if (!data || !data.verses || data.verses.length === 0) break;

      const verses = data.verses.map((v) => ({
        number: v.verse,
        text: v.text.trim(),
      }));

      bookData.chapters.push({ number: chapter, verses });
      console.log(`✅ Added ${book} ${chapter}`);

      chapter++;

      // ⏳ Delay to avoid hitting rate limit
      await delay(5000);
    }

    bible.books.push(bookData);
  }

  fs.writeFileSync('data/kjv-sample.json', JSON.stringify(bible, null, 2));
  console.log('📂 Bible saved to kjv.json');
}

// Run
buildBible();
