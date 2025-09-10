import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import { BibleData } from '@/types/bibleTypes';
import {
  TranslatedBibleData,
  TranslationLanguage,
  TranslationCache,
  TranslationProgress,
} from '@/types/translationTypes';

// Google Translate API service using axios
class GoogleTranslateService {
  private static readonly API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
  private static readonly BASE_URL =
    'https://translation.googleapis.com/language/translate/v2';

  // Configure axios instance for Google Translate API
  private static apiClient = axios.create({
    baseURL: this.BASE_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  static isConfigured(): boolean {
    return !!this.API_KEY && this.API_KEY.trim() !== '';
  }

  static async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(
        'Google Translate API key not configured. Please set EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY in your environment.'
      );
    }

    try {
      const response: AxiosResponse = await this.apiClient.post(
        '',
        {
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text',
        },
        {
          params: {
            key: this.API_KEY,
          },
        }
      );

      if (response.data?.data?.translations?.[0]?.translatedText) {
        return response.data.data.translations[0].translatedText;
      } else {
        throw new Error('Invalid response format from Google Translate API');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        console.error('Google Translate API error:', errorMessage);
        throw new Error(`Translation failed: ${errorMessage}`);
      }
      console.error('Translation error:', error);
      throw error;
    }
  }

  static async translateBatch(
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string[]> {
    if (!this.isConfigured()) {
      throw new Error(
        'Google Translate API key not configured. Please set EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY in your environment.'
      );
    }

    // Split into smaller batches to avoid API limits (Google Translate allows up to 128 text segments per request)
    const BATCH_SIZE = 50;
    const results: string[] = [];

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);

      try {
        const response: AxiosResponse = await this.apiClient.post(
          '',
          {
            q: batch,
            source: sourceLanguage,
            target: targetLanguage,
            format: 'text',
          },
          {
            params: {
              key: this.API_KEY,
            },
          }
        );

        if (response.data?.data?.translations) {
          const translations = response.data.data.translations.map(
            (t: any) => t.translatedText
          );
          results.push(...translations);
        } else {
          throw new Error('Invalid response format from Google Translate API');
        }

        // Add delay between batches to respect rate limits
        if (i + BATCH_SIZE < texts.length) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.error?.message || error.message;
          console.error(
            `Batch translation error for batch ${i / BATCH_SIZE + 1}:`,
            errorMessage
          );

          // If quota exceeded or rate limited, throw error to stop translation
          if (
            error.response?.status === 429 ||
            errorMessage.includes('quota')
          ) {
            throw new Error(
              `Translation quota exceeded or rate limited: ${errorMessage}`
            );
          }
        }

        console.error(
          `Batch translation error for batch ${i / BATCH_SIZE + 1}:`,
          error
        );
        // Fallback: return original texts for failed batch
        results.push(...batch);
      }
    }

    return results;
  }
}

export const SUPPORTED_LANGUAGES: TranslationLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
  },
  {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    flag: '🇹🇼',
  },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', flag: '🏴' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🏴' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰' },
];

const STORAGE_KEYS = {
  TRANSLATION_CACHE: 'translationCache',
  TRANSLATED_BIBLES: 'translatedBibles',
  CURRENT_LANGUAGE: 'currentLanguage',
} as const;

export class TranslationService {
  private static cache: TranslationCache = {};
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const cachedData = await AsyncStorage.getItem(
        STORAGE_KEYS.TRANSLATION_CACHE
      );
      if (cachedData) {
        this.cache = JSON.parse(cachedData);
      }
      this.isInitialized = true;
      console.log('[TranslationService] Initialized successfully');
    } catch (error) {
      console.error('Failed to initialize translation cache:', error);
      this.cache = {};
      this.isInitialized = true;
    }
  }

  static async saveCache(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TRANSLATION_CACHE,
        JSON.stringify(this.cache)
      );
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  static async translateBible(
    bibleData: BibleData,
    targetLanguage: TranslationLanguage,
    onProgress?: (progress: TranslationProgress) => void
  ): Promise<TranslatedBibleData> {
    await this.initialize();

    if (!GoogleTranslateService.isConfigured()) {
      throw new Error(
        'Google Translate API key not configured. Please add EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY to your environment variables.'
      );
    }

    const totalBooks = bibleData.books.length;
    const totalChapters = bibleData.books.reduce(
      (sum, book) => sum + book.chapters.length,
      0
    );
    let completedBooks = 0;
    let completedChapters = 0;

    const translatedBooks: any[] = [];

    try {
      for (const book of bibleData.books) {
        onProgress?.({
          isTranslating: true,
          currentBook: book.name,
          currentChapter: 0,
          totalBooks,
          totalChapters,
          completedBooks,
          completedChapters,
          progress: (completedChapters / totalChapters) * 100,
        });

        const translatedChapters = [];

        for (const chapter of book.chapters) {
          onProgress?.({
            isTranslating: true,
            currentBook: book.name,
            currentChapter: chapter.number,
            totalBooks,
            totalChapters,
            completedBooks,
            completedChapters,
            progress: (completedChapters / totalChapters) * 100,
          });

          // Check cache first
          if (
            this.cache[targetLanguage.code]?.[book.name]?.[
              chapter.number.toString()
            ]
          ) {
            translatedChapters.push(
              this.cache[targetLanguage.code][book.name][
                chapter.number.toString()
              ]
            );
            completedChapters++;
            continue;
          }

          // Translate verses using Google Translate API
          const verseTexts = chapter.verses.map((v) => v.text);
          const translatedTexts = await GoogleTranslateService.translateBatch(
            verseTexts,
            targetLanguage.code
          );

          const translatedVerses = chapter.verses.map((verse, index) => ({
            number: verse.number,
            text: translatedTexts[index] || verse.text, // Fallback to original if translation failed
            originalText: verse.text,
          }));

          const translatedChapter = {
            number: chapter.number,
            verses: translatedVerses,
          };

          translatedChapters.push(translatedChapter);

          // Cache the translated chapter
          if (!this.cache[targetLanguage.code]) {
            this.cache[targetLanguage.code] = {};
          }
          if (!this.cache[targetLanguage.code][book.name]) {
            this.cache[targetLanguage.code][book.name] = {};
          }
          this.cache[targetLanguage.code][book.name][
            chapter.number.toString()
          ] = translatedChapter;

          completedChapters++;

          // Save cache periodically to avoid losing progress
          if (completedChapters % 5 === 0) {
            await this.saveCache();
          }
        }

        // Translate book name
        let translatedBookName: string;
        try {
          translatedBookName = await GoogleTranslateService.translateText(
            book.name,
            targetLanguage.code
          );
        } catch (error) {
          console.warn(`Failed to translate book name "${book.name}":`, error);
          translatedBookName = book.name; // Fallback to original name
        }

        translatedBooks.push({
          name: translatedBookName,
          originalName: book.name,
          testament: book.testament,
          chapters: translatedChapters,
        });

        completedBooks++;
      }

      // Save final cache
      await this.saveCache();

      const translatedBible: TranslatedBibleData = {
        version: `${bibleData.version} (${targetLanguage.name})`,
        originalVersion: bibleData.version,
        language: targetLanguage,
        books: translatedBooks,
        translatedAt: new Date().toISOString(),
      };

      // Save translated Bible
      await this.saveTranslatedBible(translatedBible);

      onProgress?.({
        isTranslating: false,
        currentBook: '',
        currentChapter: 0,
        totalBooks,
        totalChapters,
        completedBooks,
        completedChapters,
        progress: 100,
      });

      console.log(
        `[TranslationService] Successfully translated Bible to ${targetLanguage.name}`
      );
      return translatedBible;
    } catch (error) {
      console.error('Translation failed:', error);

      onProgress?.({
        isTranslating: false,
        currentBook: '',
        currentChapter: 0,
        totalBooks,
        totalChapters,
        completedBooks,
        completedChapters,
        progress: 0,
      });

      throw error;
    }
  }

  static async saveTranslatedBible(
    translatedBible: TranslatedBibleData
  ): Promise<void> {
    try {
      const existingBibles = await this.getTranslatedBibles();
      const updatedBibles = existingBibles.filter(
        (bible) => bible.language.code !== translatedBible.language.code
      );
      updatedBibles.push(translatedBible);

      await AsyncStorage.setItem(
        STORAGE_KEYS.TRANSLATED_BIBLES,
        JSON.stringify(updatedBibles)
      );
      console.log(
        `[TranslationService] Saved translated Bible: ${translatedBible.language.name}`
      );
    } catch (error) {
      console.error('Failed to save translated Bible:', error);
      throw error;
    }
  }

  static async getTranslatedBibles(): Promise<TranslatedBibleData[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSLATED_BIBLES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get translated Bibles:', error);
      return [];
    }
  }

  static async getTranslatedBible(
    languageCode: string
  ): Promise<TranslatedBibleData | null> {
    const translatedBibles = await this.getTranslatedBibles();
    return (
      translatedBibles.find((bible) => bible.language.code === languageCode) ||
      null
    );
  }

  static async deleteTranslatedBible(languageCode: string): Promise<void> {
    try {
      const existingBibles = await this.getTranslatedBibles();
      const updatedBibles = existingBibles.filter(
        (bible) => bible.language.code !== languageCode
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.TRANSLATED_BIBLES,
        JSON.stringify(updatedBibles)
      );

      // Also clear from cache
      if (this.cache[languageCode]) {
        delete this.cache[languageCode];
        await this.saveCache();
      }

      console.log(`[TranslationService] Deleted translation: ${languageCode}`);
    } catch (error) {
      console.error('Failed to delete translated Bible:', error);
      throw error;
    }
  }

  static async clearAllTranslations(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TRANSLATION_CACHE,
        STORAGE_KEYS.TRANSLATED_BIBLES,
      ]);
      this.cache = {};
      console.log('[TranslationService] Cleared all translations');
    } catch (error) {
      console.error('Failed to clear translations:', error);
      throw error;
    }
  }

  static async getCurrentLanguage(): Promise<TranslationLanguage> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LANGUAGE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to get current language:', error);
    }
    return SUPPORTED_LANGUAGES[0]; // Default to English
  }

  static async setCurrentLanguage(
    language: TranslationLanguage
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_LANGUAGE,
        JSON.stringify(language)
      );
      console.log(
        `[TranslationService] Set current language: ${language.name}`
      );
    } catch (error) {
      console.error('Failed to set current language:', error);
      throw error;
    }
  }

  static isApiConfigured(): boolean {
    return GoogleTranslateService.isConfigured();
  }
}
