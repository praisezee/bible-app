import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BibleData, BibleSyncStatus } from '@/types/bibleTypes';
import {
  checkForBibleUpdates,
  fetchBibleData,
  retryApiCall,
} from '@/service/bibleSyncService';
import { miniBibleData, isMiniBible as minBible } from '@/utils/minBible';

const STORAGE_KEYS = {
  BIBLE_DATA: 'bibleData',
  LAST_SYNCED: 'lastSynced',
} as const;

export const useBibleSync = () => {
  const [bibleData, setBibleData] = useState<BibleData | null>(null);
  const [syncStatus, setSyncStatus] = useState<BibleSyncStatus>({
    isLoading: true,
    isSyncing: false,
    lastSynced: null,
    isMini: false,
    error: null,
  });

  /**
   * Load Bible data from AsyncStorage
   */
  const loadLocalBibleData = useCallback(async (): Promise<{
    data: BibleData | null;
    isMini: boolean;
  }> => {
    try {
      const [storedData, lastSynced] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.BIBLE_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNCED),
      ]);

      if (storedData) {
        const parsedData: BibleData = JSON.parse(storedData);
        const isMiniBible = lastSynced === 'fallback' || minBible(parsedData);

        console.log('[BibleSync] Loaded local Bible data:', {
          version: parsedData.version,
          books: parsedData.books.length,
          isMini: isMiniBible,
          lastSynced,
        });

        return { data: parsedData, isMini: isMiniBible };
      }

      return { data: null, isMini: false };
    } catch (error) {
      console.error('[BibleSync] Failed to load local Bible data:', error);
      return { data: null, isMini: false };
    }
  }, []);

  /**
   * Save Bible data to AsyncStorage
   */
  const saveBibleData = useCallback(
    async (data: BibleData, isFullSync: boolean = false): Promise<void> => {
      try {
        const cleanData = {
          version: data.version,
          books: data.books.map((book) => ({
            name: book.name,
            testament: book.testament,
            chapters: book.chapters.map((chapter) => ({
              number: chapter.number,
              verses: chapter.verses.map((verse) => ({
                number: verse.number,
                text: verse.text,
              })),
            })),
          })),
        };

        const lastSynced = isFullSync ? new Date().toISOString() : 'fallback';

        await Promise.all([
          AsyncStorage.setItem(
            STORAGE_KEYS.BIBLE_DATA,
            JSON.stringify(cleanData)
          ),
          AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNCED, lastSynced),
        ]);

        console.log('[BibleSync] Saved Bible data:', {
          version: data.version,
          books: data.books.length,
          isFullSync,
          lastSynced,
        });
      } catch (error) {
        console.error('[BibleSync] Failed to save Bible data:', error);
        throw error;
      }
    },
    []
  );

  /**
   * Load fallback mini Bible
   */
  const loadMiniBible = useCallback(async (): Promise<void> => {
    try {
      console.log('[BibleSync] Loading mini Bible fallback');
      await saveBibleData(miniBibleData, false);
      setBibleData(miniBibleData);

      const lastSynced = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNCED);
      setSyncStatus((prev) => ({
        ...prev,
        lastSynced,
        isMini: true,
        isLoading: false,
      }));

      Toast.show({
        type: 'info',
        text1: 'Mini Bible Loaded',
        text2: 'Full version will sync when online',
        position: 'bottom',
      });
    } catch (error) {
      console.error('[BibleSync] Failed to load mini Bible:', error);
      setSyncStatus((prev) => ({
        ...prev,
        error: 'Failed to load Bible data',
        isLoading: false,
      }));
    }
  }, [saveBibleData]);

  /**
   * Check for Bible updates from API
   */
  const checkForUpdates = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[BibleSync] Checking for updates...');
      const updateData = await retryApiCall(() => checkForBibleUpdates());

      console.log('[BibleSync] Update check result:', updateData);
      return updateData.hasRecentUpdate === true;
    } catch (error) {
      console.warn('[BibleSync] Update check failed, using local Bible data');
      return false;
    }
  }, []);

  /**
   * Sync Bible data from API
   */
  const syncBibleData = useCallback(async (): Promise<void> => {
    setSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));

    try {
      console.log('[BibleSync] Syncing Bible data from API...');
      Toast.show({
        type: 'info',
        text1: 'Updating Bible...',
        text2: 'Downloading latest version',
        position: 'bottom',
      });

      const newBibleData = await retryApiCall(() => fetchBibleData());

      // Save the new data
      await saveBibleData(newBibleData, true);
      setBibleData(newBibleData);

      const lastSynced = new Date().toISOString();
      setSyncStatus((prev) => ({
        ...prev,
        lastSynced,
        isMini: false,
        isSyncing: false,
      }));

      // Show success message, especially if upgrading from mini
      const wasUsingMini = syncStatus.isMini;
      Toast.show({
        type: 'success',
        text1: wasUsingMini ? 'Full Bible Synced!' : 'Bible Updated!',
        text2: 'Latest version downloaded successfully',
        position: 'bottom',
      });

      console.log('[BibleSync] Bible sync completed successfully');
    } catch (error) {
      console.error('[BibleSync] Bible sync failed:', error);
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        error: 'Sync failed - using current data',
      }));

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Using current Bible data',
        position: 'bottom',
      });
    }
  }, [saveBibleData, syncStatus.isMini]);

  /**
   * Initialize Bible data on app start
   */
  const initializeBibleData = useCallback(async (): Promise<void> => {
    console.log('[BibleSync] Initializing Bible data...');
    setSyncStatus((prev) => ({ ...prev, isLoading: true }));

    try {
      // Step 1: Load existing data from storage
      const { data: localData, isMini: isLocalMini } =
        await loadLocalBibleData();
      const lastSynced = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNCED);

      if (localData) {
        // We have local data, use it immediately
        setBibleData(localData);
        setSyncStatus((prev) => ({
          ...prev,
          lastSynced,
          isMini: isLocalMini,
          isLoading: false,
        }));

        console.log('[BibleSync] Using local Bible data');
      } else {
        // No local data, load mini Bible
        await loadMiniBible();
        return; // loadMiniBible handles the rest
      }

      // Step 2: Check for updates (don't block UI)
      setTimeout(async () => {
        try {
          const hasUpdates = await checkForUpdates();
          if (hasUpdates) {
            await syncBibleData();
          }
        } catch (error) {
          console.warn('[BibleSync] Background update check failed:', error);
        }
      }, 1000); // Delay to not block initial load
    } catch (error) {
      console.error('[BibleSync] Initialization failed:', error);
      // Fallback to mini Bible
      await loadMiniBible();
    }
  }, [loadLocalBibleData, loadMiniBible, checkForUpdates, syncBibleData]);

  /**
   * Handle app state changes for background sync
   */
  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && bibleData && !syncStatus.isSyncing) {
        console.log('[BibleSync] App became active, checking for updates...');
        try {
          const hasUpdates = await checkForUpdates();
          if (hasUpdates) {
            await syncBibleData();
          }
        } catch (error) {
          console.warn('[BibleSync] Background sync failed:', error);
        }
      }
    },
    [bibleData, syncStatus.isSyncing, checkForUpdates, syncBibleData]
  );

  /**
   * Manual sync trigger
   */
  const manualSync = useCallback(async (): Promise<void> => {
    if (syncStatus.isSyncing) return;

    try {
      const hasUpdates = await checkForUpdates();
      if (hasUpdates) {
        await syncBibleData();
      } else {
        Toast.show({
          type: 'info',
          text1: 'No Updates Available',
          text2: 'Bible is already up to date',
          position: 'bottom',
        });
      }
    } catch (error) {
      console.error('[BibleSync] Manual sync failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Sync Failed',
        text2: 'Please check your internet connection',
        position: 'bottom',
      });
    }
  }, [syncStatus.isSyncing, checkForUpdates, syncBibleData]);

  // Initialize on mount
  useEffect(() => {
    initializeBibleData();
  }, [initializeBibleData]);

  // Listen for app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  return {
    bibleData,
    syncStatus,
    manualSync,
    initializeBibleData,
  };
};
