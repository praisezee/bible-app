import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  AppSettings,
  BookmarkItem,
  HighlightItem,
  NoteItem,
  BookmarkGroup,
  NoteGroup,
  CustomHighlightColor,
} from '@/types/bible';
import { BibleData } from '@/types/bibleTypes';
import { storageUtils } from '@/utils/storage';
import { usePathname, useRouter } from 'expo-router';
import { useBibleSync } from '@/hooks/useBibleSync';

interface BibleContextType {
  bibleData: BibleData | null;
  settings: AppSettings;
  bookmarks: BookmarkItem[];
  highlights: HighlightItem[];
  notes: NoteItem[];
  bookmarkGroups: BookmarkGroup[];
  noteGroups: NoteGroup[];
  customHighlightColors: CustomHighlightColor[];
  currentBook: string;
  currentChapter: number;
  currentVerse: number;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  navigateToVerse: (
    book: string,
    chapter: number,
    verse: number,
    highlightVerse?: boolean
  ) => void;
  addBookmark: (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    groupId?: string
  ) => void;
  removeBookmark: (id: string) => void;
  addHighlight: (
    book: string,
    chapter: number,
    verse: number,
    color: string,
    colorName?: string
  ) => void;
  removeHighlight: (id: string) => void;
  addNote: (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    groupId?: string
  ) => void;
  updateNote: (id: string, text: string) => void;
  removeNote: (id: string) => void;
  addBookmarkGroup: (name: string, color: string) => void;
  updateBookmarkGroup: (id: string, name: string, color: string) => void;
  removeBookmarkGroup: (id: string) => void;
  addNoteGroup: (name: string, color: string) => void;
  updateNoteGroup: (id: string, name: string, color: string) => void;
  removeNoteGroup: (id: string) => void;
  addCustomHighlightColor: (name: string, color: string) => void;
  removeCustomHighlightColor: (id: string) => void;
  searchVerses: (
    query: string
  ) => Array<{ book: string; chapter: number; verse: number; text: string }>;
  highlightedVerse: { book: string; chapter: number; verse: number } | null;
  clearHighlightedVerse: () => void;
  // Sync-related properties
  syncStatus: any;
  manualSync: () => Promise<void>;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export function BibleProvider({ children }: { children: ReactNode }) {
  // Use the Bible sync hook
  const { bibleData, syncStatus, manualSync } = useBibleSync();

  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 16,
    theme: 'system',
    lineSpacing: 1.5,
    lastRead: { book: 'Barashyt', chapter: 1, verse: 1 },
  });
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [bookmarkGroups, setBookmarkGroups] = useState<BookmarkGroup[]>([]);
  const [noteGroups, setNoteGroups] = useState<NoteGroup[]>([]);
  const [customHighlightColors, setCustomHighlightColors] = useState<
    CustomHighlightColor[]
  >([]);
  const [currentBook, setCurrentBook] = useState('Barashyt');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [highlightedVerse, setHighlightedVerse] = useState<{
    book: string;
    chapter: number;
    verse: number;
  } | null>(null);

  const navigate = useRouter();

  useEffect(() => {
    initializeUserData();
  }, []);

  const initializeUserData = async () => {
    try {
      // Load user settings and data (not Bible data - that's handled by useBibleSync)
      const storedSettings = await storageUtils.getSettings();
      setSettings(storedSettings);
      setCurrentBook(storedSettings.lastRead.book);
      setCurrentChapter(storedSettings.lastRead.chapter);
      setCurrentVerse(storedSettings.lastRead.verse);

      // Load user data
      const [
        storedBookmarks,
        storedHighlights,
        storedNotes,
        storedBookmarkGroups,
        storedNoteGroups,
        storedCustomColors,
      ] = await Promise.all([
        storageUtils.getBookmarks(),
        storageUtils.getHighlights(),
        storageUtils.getNotes(),
        storageUtils.getBookmarkGroups(),
        storageUtils.getNoteGroups(),
        storageUtils.getCustomHighlightColors(),
      ]);

      setBookmarks(storedBookmarks);
      setHighlights(storedHighlights);
      setNotes(storedNotes);
      setBookmarkGroups(storedBookmarkGroups);
      setNoteGroups(storedNoteGroups);
      setCustomHighlightColors(storedCustomColors);
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await storageUtils.setSettings(updatedSettings);
  };

  const pathname = usePathname();
  const navigateToVerse = async (
    book: string,
    chapter: number,
    verse: number,
    highlightVerse = false
  ) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setCurrentVerse(verse);

    if (pathname !== '/(tabs)') {
      console.log(pathname);
      navigate.replace('/(tabs)');
    }

    if (highlightVerse) {
      setHighlightedVerse({ book, chapter, verse });
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedVerse(null);
      }, 3000);
    }

    const newLastRead = { book, chapter, verse };
    await updateSettings({ lastRead: newLastRead });
  };

  const addBookmark = async (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    groupId?: string
  ) => {
    const newBookmark: BookmarkItem = {
      id: `${book}-${chapter}-${verse}-${Date.now()}`,
      book,
      chapter,
      verse,
      text,
      groupId,
      timestamp: Date.now(),
    };
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    await storageUtils.setBookmarks(updatedBookmarks);
  };

  const removeBookmark = async (id: string) => {
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    await storageUtils.setBookmarks(updatedBookmarks);
  };

  const addHighlight = async (
    book: string,
    chapter: number,
    verse: number,
    color: string,
    colorName?: string
  ) => {
    const newHighlight: HighlightItem = {
      id: `${book}-${chapter}-${verse}-${Date.now()}`,
      book,
      chapter,
      verse,
      color,
      colorName,
      timestamp: Date.now(),
    };
    const updatedHighlights = [...highlights, newHighlight];
    setHighlights(updatedHighlights);
    await storageUtils.setHighlights(updatedHighlights);
  };

  const removeHighlight = async (id: string) => {
    const updatedHighlights = highlights.filter(
      (highlight) => highlight.id !== id
    );
    setHighlights(updatedHighlights);
    await storageUtils.setHighlights(updatedHighlights);
  };

  const addNote = async (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    groupId?: string
  ) => {
    const newNote: NoteItem = {
      id: `${book}-${chapter}-${verse}-${Date.now()}`,
      book,
      chapter,
      verse,
      text,
      groupId,
      timestamp: Date.now(),
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    await storageUtils.setNotes(updatedNotes);
  };

  const updateNote = async (id: string, text: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, text, timestamp: Date.now() } : note
    );
    setNotes(updatedNotes);
    await storageUtils.setNotes(updatedNotes);
  };

  const removeNote = async (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    await storageUtils.setNotes(updatedNotes);
  };

  const addBookmarkGroup = async (name: string, color: string) => {
    const newGroup: BookmarkGroup = {
      id: `group-${Date.now()}`,
      name,
      color,
      timestamp: Date.now(),
    };
    const updatedGroups = [...bookmarkGroups, newGroup];
    setBookmarkGroups(updatedGroups);
    await storageUtils.setBookmarkGroups(updatedGroups);
  };

  const updateBookmarkGroup = async (
    id: string,
    name: string,
    color: string
  ) => {
    const updatedGroups = bookmarkGroups.map((group) =>
      group.id === id ? { ...group, name, color, timestamp: Date.now() } : group
    );
    setBookmarkGroups(updatedGroups);
    await storageUtils.setBookmarkGroups(updatedGroups);
  };

  const removeBookmarkGroup = async (id: string) => {
    const updatedGroups = bookmarkGroups.filter((group) => group.id !== id);
    setBookmarkGroups(updatedGroups);
    await storageUtils.setBookmarkGroups(updatedGroups);

    // Remove group association from bookmarks
    const updatedBookmarks = bookmarks.map((bookmark) =>
      bookmark.groupId === id ? { ...bookmark, groupId: undefined } : bookmark
    );
    setBookmarks(updatedBookmarks);
    await storageUtils.setBookmarks(updatedBookmarks);
  };

  const addNoteGroup = async (name: string, color: string) => {
    const newGroup: NoteGroup = {
      id: `group-${Date.now()}`,
      name,
      color,
      timestamp: Date.now(),
    };
    const updatedGroups = [...noteGroups, newGroup];
    setNoteGroups(updatedGroups);
    await storageUtils.setNoteGroups(updatedGroups);
  };

  const updateNoteGroup = async (id: string, name: string, color: string) => {
    const updatedGroups = noteGroups.map((group) =>
      group.id === id ? { ...group, name, color, timestamp: Date.now() } : group
    );
    setNoteGroups(updatedGroups);
    await storageUtils.setNoteGroups(updatedGroups);
  };

  const removeNoteGroup = async (id: string) => {
    const updatedGroups = noteGroups.filter((group) => group.id !== id);
    setNoteGroups(updatedGroups);
    await storageUtils.setNoteGroups(updatedGroups);

    // Remove group association from notes
    const updatedNotes = notes.map((note) =>
      note.groupId === id ? { ...note, groupId: undefined } : note
    );
    setNotes(updatedNotes);
    await storageUtils.setNotes(updatedNotes);
  };

  const addCustomHighlightColor = async (name: string, color: string) => {
    const newColor: CustomHighlightColor = {
      id: `color-${Date.now()}`,
      name,
      color,
      timestamp: Date.now(),
    };
    const updatedColors = [...customHighlightColors, newColor];
    setCustomHighlightColors(updatedColors);
    await storageUtils.setCustomHighlightColors(updatedColors);
  };

  const removeCustomHighlightColor = async (id: string) => {
    const updatedColors = customHighlightColors.filter(
      (color) => color.id !== id
    );
    setCustomHighlightColors(updatedColors);
    await storageUtils.setCustomHighlightColors(updatedColors);
  };

  const clearHighlightedVerse = () => {
    setHighlightedVerse(null);
  };

  const searchVerses = (query: string) => {
    if (!bibleData || !query.trim()) return [];

    const results: Array<{
      book: string;
      chapter: number;
      verse: number;
      text: string;
    }> = [];
    const searchTerm = query.toLowerCase().trim();

    // Check if it's a reference search (e.g., "John 3:16")
    const referenceMatch = searchTerm.match(/(\w+)\s*(\d+):(\d+)/);
    if (referenceMatch) {
      const [, bookName, chapterNum, verseNum] = referenceMatch;
      const book = bibleData.books.find((b) =>
        b.name.toLowerCase().includes(bookName.toLowerCase())
      );
      if (book) {
        const chapter = book.chapters.find(
          (c) => c.number === parseInt(chapterNum)
        );
        if (chapter) {
          const verse = chapter.verses.find(
            (v) => v.number === parseInt(verseNum)
          );
          if (verse) {
            results.push({
              book: book.name,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text,
            });
          }
        }
      }
      return results;
    }

    // Text search
    bibleData.books.forEach((book) => {
      book.chapters.forEach((chapter) => {
        chapter.verses.forEach((verse) => {
          if (verse.text.toLowerCase().includes(searchTerm)) {
            results.push({
              book: book.name,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text,
            });
          }
        });
      });
    });

    return results.slice(0, 100); // Limit results for performance
  };

  return (
    <BibleContext.Provider
      value={{
        bibleData,
        settings,
        bookmarks,
        highlights,
        notes,
        bookmarkGroups,
        noteGroups,
        customHighlightColors,
        currentBook,
        currentChapter,
        currentVerse,
        isLoading: syncStatus.isLoading,
        updateSettings,
        navigateToVerse,
        addBookmark,
        removeBookmark,
        addHighlight,
        removeHighlight,
        addNote,
        updateNote,
        removeNote,
        addBookmarkGroup,
        updateBookmarkGroup,
        removeBookmarkGroup,
        addNoteGroup,
        updateNoteGroup,
        removeNoteGroup,
        addCustomHighlightColor,
        removeCustomHighlightColor,
        searchVerses,
        highlightedVerse,
        clearHighlightedVerse,
        // Sync-related
        syncStatus,
        manualSync,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
}
