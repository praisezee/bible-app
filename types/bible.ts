// Re-export from bibleTypes for backward compatibility
export type {
  VerseData as Verse,
  ChapterData as Chapter,
  BookData as Book,
  BibleData,
} from './bibleTypes';

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
