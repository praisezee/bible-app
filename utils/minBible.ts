import { BibleData } from '@/types/bibleTypes';
import hebrewBible from '@/data/hebrew_bible.json';

/**
 * Minimal Bible data for offline fallback
 * Contains Barashyt 1:1-3 as a sample
 */
export const miniBibleData: BibleData = hebrewBible as BibleData;

/**
 * Check if the provided Bible data is the mini version
 */
export const isMiniBible = (bibleData: BibleData): boolean => {
  return (
    bibleData.version === 'Mini Hebrew Bible' || bibleData.books.length === 1
  );
};
