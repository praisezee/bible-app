export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VerseData {
  number: number;
  text: string;
}

export interface ChapterData {
  number: number;
  verses: VerseData[];
}

export interface BookData {
  name: string;
  testament: string;
  chapters: ChapterData[];
}

export interface BibleData {
  version: string;
  books: BookData[];
}

export interface UpdateCheckData {
  hasRecentUpdate: boolean;
  latestTimestamp?: string; // ISO string from backend Date
}

// Sync status interface for UI
export interface BibleSyncStatus {
  isLoading: boolean;
  isSyncing: boolean;
  lastSynced: string | null; // ISO date or 'fallback'
  isMini: boolean;
  error: string | null;
}
