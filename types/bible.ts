export interface Verse {
  number: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  name: string;
  chapters: Chapter[];
  testament: 'old' | 'new';
}

export interface BibleData {
  version: string;
  books: Book[];
}

export interface BookmarkItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  groupId?: string;
  timestamp: number;
}

export interface HighlightItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
  colorName?: string;
  timestamp: number;
}

export interface NoteItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  groupId?: string;
  timestamp: number;
}

export interface BookmarkGroup {
  id: string;
  name: string;
  color: string;
  timestamp: number;
}

export interface NoteGroup {
  id: string;
  name: string;
  color: string;
  timestamp: number;
}

export interface CustomHighlightColor {
  id: string;
  name: string;
  color: string;
  timestamp: number;
}

export interface AppSettings {
  fontSize: number;
  theme: 'light' | 'dark' | 'system' | 'custom';
  customTheme?: {
    name: string;
    backgroundColor: string;
    textColor: string;
    cardColor: string;
    borderColor: string;
    accentColor: string;
  };
  lineSpacing: number;
  lastRead: {
    book: string;
    chapter: number;
    verse: number;
  };
}

export interface UserInteraction {
  book: string;
  chapter: number;
  verse: number;
  isBookmarked?: boolean;
  highlightColor?: string;
  note?: string;
}
