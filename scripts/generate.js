import fs from 'fs';
import fetch from 'node-fetch';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const books = [
  // OLD COVENANT
  {
    eng: 'Genesis',
    name: 'Barashyt',
    chapters: 50,
    testament: 'old',
    sacredUrl: 'bib/kjv/gen',
  },
  {
    eng: 'Enoch',
    name: 'Chanuk',
    chapters: 108,
    testament: 'old',
    sacredUrl: 'bib/boe/boe',
    chapterOffset: 3,
  },
  {
    eng: 'Jubilees',
    name: 'Yubalym',
    chapters: 50,
    testament: 'old',
    sacredUrl: 'bib/jub/jub',
  },
  {
    eng: 'Exodus',
    name: 'Shamuth',
    chapters: 40,
    testament: 'old',
    sacredUrl: 'bib/kjv/exo',
  },
  {
    eng: 'Leviticus',
    name: 'Uayiqrah',
    chapters: 27,
    testament: 'old',
    sacredUrl: 'bib/kjv/lev',
  },
  {
    eng: 'Numbers',
    name: 'Bamidbar',
    chapters: 36,
    testament: 'old',
    sacredUrl: 'bib/kjv/num',
  },
  {
    eng: 'Deuteronomy',
    name: 'Dabarym',
    chapters: 34,
    testament: 'old',
    sacredUrl: 'bib/kjv/deu',
  },
  {
    eng: 'Joshua',
    name: "Yahusha Ba'Nun",
    chapters: 24,
    testament: 'old',
    sacredUrl: 'bib/kjv/jos',
  },
  {
    eng: 'Judges',
    name: 'Shuphatym',
    chapters: 21,
    testament: 'old',
    sacredUrl: 'bib/kjv/jdg',
  },
  {
    eng: 'Ruth',
    name: 'Ruth',
    chapters: 4,
    testament: 'old',
    sacredUrl: 'bib/kjv/rut',
  },
  {
    eng: '1 Samuel',
    name: "1st Shamu'AL",
    chapters: 31,
    testament: 'old',
    sacredUrl: 'bib/kjv/1sa',
  },
  {
    eng: '2 Samuel',
    name: "2nd Shamu'AL",
    chapters: 24,
    testament: 'old',
    sacredUrl: 'bib/kjv/2sa',
  },
  {
    eng: '1 Kings',
    name: '1st Kings',
    chapters: 22,
    testament: 'old',
    sacredUrl: 'bib/kjv/1ki',
  },
  {
    eng: '2 Kings',
    name: '2nd Kings',
    chapters: 25,
    testament: 'old',
    sacredUrl: 'bib/kjv/2ki',
  },
  {
    eng: '1 Chronicles',
    name: '1st Dabar-Hayamym',
    chapters: 29,
    testament: 'old',
    sacredUrl: 'bib/kjv/1ch',
  },
  {
    eng: '2 Chronicles',
    name: '2nd Dabar-Hayamym',
    chapters: 36,
    testament: 'old',
    sacredUrl: 'bib/kjv/2ch',
  },
  {
    eng: 'Psalms',
    name: 'Tahalym',
    chapters: 151,
    testament: 'old',
    sacredUrl: 'bib/kjv/psa',
  },
  {
    eng: 'Proverbs',
    name: 'Mashaym',
    chapters: 31,
    testament: 'old',
    sacredUrl: 'bib/kjv/pro',
  },
  {
    eng: 'Ecclesiastes',
    name: 'Quhalath',
    chapters: 12,
    testament: 'old',
    sacredUrl: 'bib/kjv/ecc',
  },
  {
    eng: 'Song of Solomon',
    name: 'Shyr Shalumah',
    chapters: 8,
    testament: 'old',
    sacredUrl: 'bib/kjv/sng',
  },
  {
    eng: 'Wisdom of Solomon',
    name: 'Chukmah Shalumah',
    chapters: 19,
    testament: 'old',
    sacredUrl: 'bib/apo/wis',
  },
  {
    eng: 'Job',
    name: 'Ayub',
    chapters: 42,
    testament: 'old',
    sacredUrl: 'bib/kjv/job',
  },
  {
    eng: 'Isaiah',
    name: "Yasha'Yahu",
    chapters: 66,
    testament: 'old',
    sacredUrl: 'bib/kjv/isa',
  },
  {
    eng: 'Jeremiah',
    name: "Yaram'Yahu",
    chapters: 52,
    testament: 'old',
    sacredUrl: 'bib/kjv/jer',
  },
  {
    eng: 'Ezekiel',
    name: "Azaky'AL",
    chapters: 48,
    testament: 'old',
    sacredUrl: 'bib/kjv/ezk',
  },
  {
    eng: 'Lamentations',
    name: 'Qynah',
    chapters: 5,
    testament: 'old',
    sacredUrl: 'bib/kjv/lam',
  },
  {
    eng: 'Daniel',
    name: "Dany'AL",
    chapters: 12,
    testament: 'old',
    sacredUrl: 'bib/kjv/dan',
  },
  {
    eng: 'Hosea',
    name: 'Husha',
    chapters: 14,
    testament: 'old',
    sacredUrl: 'bib/kjv/hos',
  },
  {
    eng: 'Joel',
    name: "Yu'AL",
    chapters: 3,
    testament: 'old',
    sacredUrl: 'bib/kjv/joe',
  },
  {
    eng: 'Obadiah',
    name: 'UbadYahu',
    chapters: 1,
    testament: 'old',
    sacredUrl: 'bib/kjv/oba',
  },
  {
    eng: 'Amos',
    name: 'Amus',
    chapters: 9,
    testament: 'old',
    sacredUrl: 'bib/kjv/amo',
  },
  {
    eng: 'Jonah',
    name: 'Yunah',
    chapters: 4,
    testament: 'old',
    sacredUrl: 'bib/kjv/jon',
  },
  {
    eng: 'Micah',
    name: "Mika'Yahu",
    chapters: 7,
    testament: 'old',
    sacredUrl: 'bib/kjv/mic',
  },
  {
    eng: 'Nahum',
    name: 'Nahun',
    chapters: 3,
    testament: 'old',
    sacredUrl: 'bib/kjv/nah',
  },
  {
    eng: 'Habakkuk',
    name: 'Habakkuk',
    chapters: 3,
    testament: 'old',
    sacredUrl: 'bib/kjv/hab',
  },
  {
    eng: 'Zephaniah',
    name: "Zaphan'Yahu",
    chapters: 3,
    testament: 'old',
    sacredUrl: 'bib/kjv/zep',
  },
  {
    eng: 'Malachi',
    name: 'Malaky',
    chapters: 4,
    testament: 'old',
    sacredUrl: 'bib/kjv/mal',
  },
  {
    eng: 'Ezra',
    name: 'Àzrah',
    chapters: 10,
    testament: 'old',
    sacredUrl: 'bib/kjv/ezr',
  },
  {
    eng: 'Nehemiah',
    name: "Naham'Yahu",
    chapters: 13,
    testament: 'old',
    sacredUrl: 'bib/kjv/neh',
  },
  {
    eng: 'Esther',
    name: 'Austah',
    chapters: 10,
    testament: 'old',
    sacredUrl: 'bib/kjv/est',
  },
  {
    eng: 'Tobit',
    name: 'TubiYahu',
    chapters: 14,
    testament: 'old',
    sacredUrl: 'bib/apo/tob',
  },
  {
    eng: 'Judith',
    name: 'Yudit',
    chapters: 16,
    testament: 'old',
    sacredUrl: 'bib/apo/jdt',
  },
  {
    eng: 'Sirach',
    name: 'Shirach',
    chapters: 51,
    testament: 'old',
    sacredUrl: 'bib/apo/sir',
  },
  {
    eng: 'Baruch',
    name: 'Baruch',
    chapters: 5,
    testament: 'old',
    sacredUrl: 'bib/apo/bar',
  },
  {
    eng: 'Epistle of Jeremiah',
    name: "Caphar (Letter) of Yaram'Yahu",
    chapters: 1,
    testament: 'old',
    sacredUrl: 'bib/apo/epj',
    chapterOffset: 5,
  },
  {
    eng: 'Song of the Three Holy Children',
    name: 'Songs of the Three Young Men',
    chapters: 1,
    testament: 'old',
    sacredUrl: 'bib/apo/s3h',
  },
  {
    eng: 'Susanna',
    name: 'Susannah',
    chapters: 1,
    testament: 'old',
    sacredUrl: 'bib/apo/sus',
  },
  {
    eng: 'Bel and the Dragon',
    name: "Dany'AL Destroyed Bal and the Dragon",
    chapters: 1,
    testament: 'old',
    sacredUrl: 'bib/apo/bel',
  },
  {
    eng: 'Prayer of Manasseh',
    name: 'Prayer of Manassah',
    chapters: 1,
    testament: 'old',
    sacredUrl: 'bib/apo/man',
  },
  {
    eng: '1 Esdras',
    name: '1st Book of Àzrah',
    chapters: 9,
    testament: 'old',
    sacredUrl: 'bib/apo/1es',
  },
  {
    eng: '2 Esdras',
    name: '2nd Book of Àzrah',
    chapters: 16,
    testament: 'old',
    sacredUrl: 'bib/apo/2es',
  },
  // NEW COVENANT
  {
    eng: 'Matthew',
    name: 'MattatYahu',
    chapters: 28,
    testament: 'new',
    sacredUrl: 'bib/kjv/mat',
  },
  {
    eng: 'Mark',
    name: 'Maqus',
    chapters: 16,
    testament: 'new',
    sacredUrl: 'bib/kjv/mar',
  },
  {
    eng: 'Luke',
    name: 'Luqas',
    chapters: 24,
    testament: 'new',
    sacredUrl: 'bib/kjv/luk',
  },
  {
    eng: 'John',
    name: 'Yahukanun',
    chapters: 21,
    testament: 'new',
    sacredUrl: 'bib/kjv/joh',
  },
  {
    eng: 'Acts',
    name: "Ma'ashym",
    chapters: 28,
    testament: 'new',
    sacredUrl: 'bib/kjv/act',
  },
  {
    eng: 'Romans',
    name: 'Romans',
    chapters: 16,
    testament: 'new',
    sacredUrl: 'bib/kjv/rom',
  },
  {
    eng: '1 Corinthians',
    name: '1st Corinthians',
    chapters: 16,
    testament: 'new',
    sacredUrl: 'bib/kjv/1co',
  },
  {
    eng: '2 Corinthians',
    name: '2nd Corinthians',
    chapters: 13,
    testament: 'new',
    sacredUrl: 'bib/kjv/2co',
  },
  {
    eng: 'Galatians',
    name: 'Galatians',
    chapters: 6,
    testament: 'new',
    sacredUrl: 'bib/kjv/gal',
  },
  {
    eng: 'Ephesians',
    name: 'Ephesians',
    chapters: 6,
    testament: 'new',
    sacredUrl: 'bib/kjv/eph',
  },
  {
    eng: 'Colossians',
    name: 'Colossians',
    chapters: 4,
    testament: 'new',
    sacredUrl: 'bib/kjv/col',
  },
  {
    eng: '1 Thessalonians',
    name: '1st Thessalonians',
    chapters: 5,
    testament: 'new',
    sacredUrl: 'bib/kjv/1th',
  },
  {
    eng: '2 Thessalonians',
    name: '2nd Thessalonians',
    chapters: 3,
    testament: 'new',
    sacredUrl: 'bib/kjv/2th',
  },
  {
    eng: '1 Timothy',
    name: '1st Timothy',
    chapters: 6,
    testament: 'new',
    sacredUrl: 'bib/kjv/1ti',
  },
  {
    eng: '2 Timothy',
    name: '2nd Timothy',
    chapters: 4,
    testament: 'new',
    sacredUrl: 'bib/kjv/2ti',
  },
  {
    eng: 'Titus',
    name: 'Titus',
    chapters: 3,
    testament: 'new',
    sacredUrl: 'bib/kjv/tit',
  },
  {
    eng: 'Philemon',
    name: 'Philemon',
    chapters: 1,
    testament: 'new',
    sacredUrl: 'bib/kjv/phm',
  },
  {
    eng: 'Hebrews',
    name: 'Abarym',
    chapters: 13,
    testament: 'new',
    sacredUrl: 'bib/kjv/heb',
  },
  {
    eng: 'James',
    name: "Ya'aqub",
    chapters: 5,
    testament: 'new',
    sacredUrl: 'bib/kjv/jam',
  },
  {
    eng: '1 Peter',
    name: '1st Kafa',
    chapters: 5,
    testament: 'new',
    sacredUrl: 'bib/kjv/1pe',
  },
  {
    eng: '2 Peter',
    name: '2nd Kafa',
    chapters: 3,
    testament: 'new',
    sacredUrl: 'bib/kjv/2pe',
  },
  {
    eng: '1 John',
    name: '1st Yahukanun',
    chapters: 5,
    testament: 'new',
    sacredUrl: 'bib/kjv/1jo',
  },
  {
    eng: '2 John',
    name: '2nd Yahukanun',
    chapters: 1,
    testament: 'new',
    sacredUrl: 'bib/kjv/2jo',
  },
  {
    eng: '3 John',
    name: '3rd Yahukanun',
    chapters: 1,
    testament: 'new',
    sacredUrl: 'bib/kjv/3jo',
  },
  {
    eng: 'Jude',
    name: 'Yahudah',
    chapters: 1,
    testament: 'new',
    sacredUrl: 'bib/kjv/jud',
  },
  {
    eng: 'Revelation',
    name: 'Chazayun',
    chapters: 22,
    testament: 'new',
    sacredUrl: 'bib/kjv/rev',
  },
];

// Fetch from bible-api
async function fetchFromBibleApi(book, chapter) {
  const url = `https://bible-api.com/${encodeURIComponent(
    book + ' ' + chapter
  )}?translation=kjv`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(
      `Error fetching ${book} ${chapter} from bible-api.com:`,
      error.message
    );
    return null;
  }
}

// Fetch from Sefaria
async function fetchFromSefaria(book, chapter) {
  const url = `https://www.sefaria.org/api/texts/${encodeURIComponent(
    book
  )}.${chapter}?lang=english&version=KJV`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(
      `Error fetching ${book} ${chapter} from sefaria.org:`,
      error.message
    );
    return null;
  }
}

// Fetch from sacred-texts.com (fallback) with retry logic
async function fetchFromSacredTexts(
  sacredUrl,
  chapter,
  chapterOffset = 0,
  retries = 2
) {
  const adjustedChapter = chapter + chapterOffset;
  const url = `https://www.sacred-texts.com/${sacredUrl}${adjustedChapter
    .toString()
    .padStart(3, '0')}.htm`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(
          `Attempt ${attempt}: Failed to fetch ${url} (status: ${res.status})`
        );
        if (attempt === retries) return null;
        await delay(3000);
        continue;
      }
      const html = await res.text();

      // Try standard verse parsing
      const verseRegex =
        /<p[^>]*>\s*?(?:<a[^>]*>)?\s*?(\d+)\s*?([^<]+?)(?=(?:<\/p>|<\/a>|<\/b>|<\/i>|<\/font>|<\/small>|<\/big>|$))/gi;
      const verses = [];
      let match;
      while ((match = verseRegex.exec(html)) !== null) {
        const number = parseInt(match[1], 10);
        const text = match[2]
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/<[^>]+>/g, '');
        if (text && !text.includes('This chapter is not available')) {
          verses.push({ number, text });
        }
      }

      // Fallback for chapters without numbered verses (e.g., Enoch Chapter 4)
      if (verses.length === 0) {
        // Try <p> or <div> tags for main content
        const fallbackRegex = /<(p|div)[^>]*>(.*?)(?:<\/\1>|$)/gi;
        let fallbackMatch = fallbackRegex.exec(html);
        while (fallbackMatch !== null) {
          const text = fallbackMatch[2]
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/<[^>]+>/g, '');
          if (
            text &&
            !text.includes('This chapter is not available') &&
            !text.includes('Sacred Texts') &&
            !text.includes('Next: Chapter')
          ) {
            verses.push({ number: 1, text });
            break; // Take the first valid content block
          }
          fallbackMatch = fallbackRegex.exec(html);
        }
      }

      return verses.length > 0 ? verses : null;
    } catch (error) {
      console.error(
        `Attempt ${attempt}: Error fetching ${url}:`,
        error.message
      );
      if (attempt === retries) return null;
      await delay(3000);
    }
  }
  return null;
}

// Try all sources
async function fetchChapter(book, chapter, sacredUrl, chapterOffset = 0) {
  // Try bible-api.com first
  let data = await fetchFromBibleApi(book, chapter);
  if (data && data.verses) {
    console.log(`  ✅ ${book} ${chapter} (from bible-api.com)`);
    return data.verses.map((v) => ({ number: v.verse, text: v.text.trim() }));
  }

  // Try Sefaria second
  let sef = await fetchFromSefaria(book, chapter);
  if (sef && sef.text) {
    console.log(`  ✅ ${book} ${chapter} (from sefaria.org)`);
    return sef.text.map((t, i) => ({ number: i + 1, text: t }));
  }

  // Fallback to sacred-texts.com
  let sacred = await fetchFromSacredTexts(sacredUrl, chapter, chapterOffset);
  if (sacred) {
    console.log(`  ✅ ${book} ${chapter} (from sacred-texts.com)`);
    return sacred;
  }

  return null;
}

// Build JSON
async function buildBible() {
  const bible = { version: 'KJV + Apocrypha', books: [] };

  for (const b of books) {
    console.log(`📖 Processing ${b.name} (${b.eng})`);
    const bookData = { name: b.name, testament: b.testament, chapters: [] };

    for (let ch = 1; ch <= b.chapters; ch++) {
      const verses = await fetchChapter(
        b.eng,
        ch,
        b.sacredUrl,
        b.chapterOffset || 0
      );
      if (!verses) {
        console.warn(`⚠️ Missing ${b.eng} ${ch} (all sources failed)`);
        continue;
      }
      bookData.chapters.push({ number: ch, verses });
      await delay(1000);
    }

    bible.books.push(bookData);
  }

  try {
    fs.writeFileSync('data/hebrew_bible.json', JSON.stringify(bible, null, 2));
    console.log('✅ Done! Saved to /data/hebrew_bible.json');
  } catch (error) {
    console.error('Error saving hebrew_bible.json:', error.message);
  }
}

buildBible();
