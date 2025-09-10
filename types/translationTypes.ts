export interface TranslationLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslatedVerse {
  number: number;
  text: string;
  originalText: string;
}

export interface TranslatedChapter {
  number: number;
  verses: TranslatedVerse[];
}

export interface TranslatedBook {
  name: string;
  originalName: string;
  testament: string;
  chapters: TranslatedChapter[];
}

export interface TranslatedBibleData {
  version: string;
  originalVersion: string;
  language: TranslationLanguage;
  books: TranslatedBook[];
  translatedAt: string; // ISO timestamp
}

export interface TranslationProgress {
  isTranslating: boolean;
  currentBook: string;
  currentChapter: number;
  totalBooks: number;
  totalChapters: number;
  completedBooks: number;
  completedChapters: number;
  progress: number; // 0-100
}

export interface TranslationCache {
  [languageCode: string]: {
    [bookName: string]: {
      [chapterNumber: string]: TranslatedChapter;
    };
  };
}
