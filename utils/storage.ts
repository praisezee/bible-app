import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BookmarkItem,
  HighlightItem,
  NoteItem,
  AppSettings,
  BookmarkGroup,
  NoteGroup,
  CustomHighlightColor,
} from '@/types/bible';
import { BibleData } from '@/types/bibleTypes';

const STORAGE_KEYS = {
  BIBLE_DATA: 'bibleData',
  BOOKMARKS: 'bookmarks',
  HIGHLIGHTS: 'highlights',
  NOTES: 'notes',
  SETTINGS: 'settings',
  BOOKMARK_GROUPS: 'bookmarkGroups',
  NOTE_GROUPS: 'noteGroups',
  CUSTOM_HIGHLIGHT_COLORS: 'customHighlightColors',
};

export const storageUtils = {
  // Bible Data
  async getBibleData(): Promise<BibleData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BIBLE_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting Bible data:', error);
      return null;
    }
  },

  async setBibleData(data: BibleData): Promise<void> {
    try {
      // Note: Bible data is now managed by useBibleSync hook
      // This method is kept for backward compatibility
      console.warn(
        'setBibleData called - Bible data should be managed by useBibleSync'
      );
      await AsyncStorage.setItem(STORAGE_KEYS.BIBLE_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting Bible data:', error);
    }
  },

  // Bookmarks
  async getBookmarks(): Promise<BookmarkItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  async setBookmarks(bookmarks: BookmarkItem[]): Promise<void> {
    try {
      // Clean bookmarks to avoid circular references
      const cleanBookmarks = bookmarks.map((bookmark) => ({
        id: bookmark.id,
        book: bookmark.book,
        chapter: bookmark.chapter,
        verse: bookmark.verse,
        text: bookmark.text,
        groupId: bookmark.groupId,
        timestamp: bookmark.timestamp,
      }));
      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(cleanBookmarks)
      );
    } catch (error) {
      console.error('Error setting bookmarks:', error);
    }
  },

  // Highlights
  async getHighlights(): Promise<HighlightItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting highlights:', error);
      return [];
    }
  },

  async setHighlights(highlights: HighlightItem[]): Promise<void> {
    try {
      // Clean highlights to avoid circular references
      const cleanHighlights = highlights.map((highlight) => ({
        id: highlight.id,
        book: highlight.book,
        chapter: highlight.chapter,
        verse: highlight.verse,
        color: highlight.color,
        colorName: highlight.colorName,
        timestamp: highlight.timestamp,
      }));
      await AsyncStorage.setItem(
        STORAGE_KEYS.HIGHLIGHTS,
        JSON.stringify(cleanHighlights)
      );
    } catch (error) {
      console.error('Error setting highlights:', error);
    }
  },

  // Notes
  async getNotes(): Promise<NoteItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  async setNotes(notes: NoteItem[]): Promise<void> {
    try {
      // Clean notes to avoid circular references
      const cleanNotes = notes.map((note) => ({
        id: note.id,
        book: note.book,
        chapter: note.chapter,
        verse: note.verse,
        text: note.text,
        groupId: note.groupId,
        timestamp: note.timestamp,
      }));
      await AsyncStorage.setItem(
        STORAGE_KEYS.NOTES,
        JSON.stringify(cleanNotes)
      );
    } catch (error) {
      console.error('Error setting notes:', error);
    }
  },

  // Settings
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data
        ? JSON.parse(data)
        : {
            fontSize: 16,
            theme: 'system',
            lineSpacing: 1.5,
            lastRead: { book: 'Barashyt', chapter: 1, verse: 1 },
          };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        fontSize: 16,
        theme: 'system',
        lineSpacing: 1.5,
        lastRead: { book: 'Barashyt', chapter: 1, verse: 1 },
      };
    }
  },

  async setSettings(settings: AppSettings): Promise<void> {
    try {
      // Clean settings to avoid circular references
      const cleanSettings = {
        fontSize: settings.fontSize,
        theme: settings.theme,
        customTheme: settings.customTheme
          ? {
              name: settings.customTheme.name,
              backgroundColor: settings.customTheme.backgroundColor,
              textColor: settings.customTheme.textColor,
              cardColor: settings.customTheme.cardColor,
              borderColor: settings.customTheme.borderColor,
              accentColor: settings.customTheme.accentColor,
            }
          : undefined,
        lineSpacing: settings.lineSpacing,
        lastRead: {
          book: settings.lastRead.book,
          chapter: settings.lastRead.chapter,
          verse: settings.lastRead.verse,
        },
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(cleanSettings)
      );
    } catch (error) {
      console.error('Error setting settings:', error);
    }
  },

  // Bookmark Groups
  async getBookmarkGroups(): Promise<BookmarkGroup[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARK_GROUPS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting bookmark groups:', error);
      return [];
    }
  },

  async setBookmarkGroups(groups: BookmarkGroup[]): Promise<void> {
    try {
      // Clean groups to avoid circular references
      const cleanGroups = groups.map((group) => ({
        id: group.id,
        name: group.name,
        color: group.color,
        timestamp: group.timestamp,
      }));
      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARK_GROUPS,
        JSON.stringify(cleanGroups)
      );
    } catch (error) {
      console.error('Error setting bookmark groups:', error);
    }
  },

  // Note Groups
  async getNoteGroups(): Promise<NoteGroup[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTE_GROUPS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting note groups:', error);
      return [];
    }
  },

  async setNoteGroups(groups: NoteGroup[]): Promise<void> {
    try {
      // Clean groups to avoid circular references
      const cleanGroups = groups.map((group) => ({
        id: group.id,
        name: group.name,
        color: group.color,
        timestamp: group.timestamp,
      }));
      await AsyncStorage.setItem(
        STORAGE_KEYS.NOTE_GROUPS,
        JSON.stringify(cleanGroups)
      );
    } catch (error) {
      console.error('Error setting note groups:', error);
    }
  },

  // Custom Highlight Colors
  async getCustomHighlightColors(): Promise<CustomHighlightColor[]> {
    try {
      const data = await AsyncStorage.getItem(
        STORAGE_KEYS.CUSTOM_HIGHLIGHT_COLORS
      );
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting custom highlight colors:', error);
      return [];
    }
  },

  async setCustomHighlightColors(
    colors: CustomHighlightColor[]
  ): Promise<void> {
    try {
      // Clean colors to avoid circular references
      const cleanColors = colors.map((color) => ({
        id: color.id,
        name: color.name,
        color: color.color,
        timestamp: color.timestamp,
      }));
      await AsyncStorage.setItem(
        STORAGE_KEYS.CUSTOM_HIGHLIGHT_COLORS,
        JSON.stringify(cleanColors)
      );
    } catch (error) {
      console.error('Error setting custom highlight colors:', error);
    }
  },

  // Utility functions
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.BOOKMARKS,
        STORAGE_KEYS.HIGHLIGHTS,
        STORAGE_KEYS.NOTES,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.BOOKMARK_GROUPS,
        STORAGE_KEYS.NOTE_GROUPS,
        STORAGE_KEYS.CUSTOM_HIGHLIGHT_COLORS,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};
