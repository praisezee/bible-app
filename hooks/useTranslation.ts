import { useState, useEffect, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { BibleData } from '@/types/bibleTypes';
import {
  TranslatedBibleData,
  TranslationLanguage,
  TranslationProgress,
} from '@/types/translationTypes';
import {
  TranslationService,
  SUPPORTED_LANGUAGES,
} from '@/service/translationService';

export const useTranslation = (originalBible: BibleData | null) => {
  const [translatedBibles, setTranslatedBibles] = useState<
    TranslatedBibleData[]
  >([]);
  const [currentLanguage, setCurrentLanguageState] =
    useState<TranslationLanguage>(
      SUPPORTED_LANGUAGES[0] // Default to English
    );
  const [translationProgress, setTranslationProgress] =
    useState<TranslationProgress>({
      isTranslating: false,
      currentBook: '',
      currentChapter: 0,
      totalBooks: 0,
      totalChapters: 0,
      completedBooks: 0,
      completedChapters: 0,
      progress: 0,
    });
  const [isLoading, setIsLoading] = useState(true);

  // Load existing translations and current language on mount
  useEffect(() => {
    loadTranslationData();
  }, []);

  const loadTranslationData = useCallback(async () => {
    try {
      setIsLoading(true);
      await TranslationService.initialize();

      const [bibles, savedLanguage] = await Promise.all([
        TranslationService.getTranslatedBibles(),
        TranslationService.getCurrentLanguage(),
      ]);

      setTranslatedBibles(bibles);
      setCurrentLanguageState(savedLanguage);

      console.log(
        `[useTranslation] Loaded ${bibles.length} translations, current: ${savedLanguage.name}`
      );
    } catch (error) {
      console.error('Failed to load translation data:', error);
      Toast.show({
        type: 'error',
        text1: 'Translation Error',
        text2: 'Failed to load translations',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const translateBible = useCallback(
    async (targetLanguage: TranslationLanguage) => {
      if (!originalBible) {
        Toast.show({
          type: 'error',
          text1: 'Translation Error',
          text2: 'Original Bible data not available',
          position: 'bottom',
        });
        return;
      }

      if (!TranslationService.isApiConfigured()) {
        Toast.show({
          type: 'error',
          text1: 'API Key Required',
          text2: 'Please configure Google Translate API key in settings',
          position: 'bottom',
        });
        return;
      }

      // Check if translation already exists
      const existingTranslation = translatedBibles.find(
        (bible) => bible.language.code === targetLanguage.code
      );

      if (existingTranslation) {
        Toast.show({
          type: 'info',
          text1: 'Translation Exists',
          text2: `Bible already translated to ${targetLanguage.name}`,
          position: 'bottom',
        });
        return;
      }

      try {
        Toast.show({
          type: 'info',
          text1: 'Starting Translation',
          text2: `Translating Bible to ${targetLanguage.name}...`,
          position: 'bottom',
        });

        const translatedBible = await TranslationService.translateBible(
          originalBible,
          targetLanguage,
          setTranslationProgress
        );

        // Update state
        setTranslatedBibles((prev) => [
          ...prev.filter((b) => b.language.code !== targetLanguage.code),
          translatedBible,
        ]);

        Toast.show({
          type: 'success',
          text1: 'Translation Complete',
          text2: `Bible translated to ${targetLanguage.name}`,
          position: 'bottom',
        });
      } catch (error) {
        console.error('Translation failed:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        Toast.show({
          type: 'error',
          text1: 'Translation Failed',
          text2: errorMessage.includes('API key')
            ? 'Please check your API key'
            : 'Please try again later',
          position: 'bottom',
        });
      } finally {
        setTranslationProgress((prev) => ({ ...prev, isTranslating: false }));
      }
    },
    [originalBible, translatedBibles]
  );

  const deleteTranslation = useCallback(
    async (languageCode: string) => {
      try {
        await TranslationService.deleteTranslatedBible(languageCode);
        setTranslatedBibles((prev) =>
          prev.filter((bible) => bible.language.code !== languageCode)
        );

        // If current language was deleted, switch to English
        if (currentLanguage.code === languageCode) {
          const englishLang = SUPPORTED_LANGUAGES[0];
          setCurrentLanguageState(englishLang);
          await TranslationService.setCurrentLanguage(englishLang);
        }

        Toast.show({
          type: 'success',
          text1: 'Translation Deleted',
          text2: 'Translation removed successfully',
          position: 'bottom',
        });
      } catch (error) {
        console.error('Failed to delete translation:', error);
        Toast.show({
          type: 'error',
          text1: 'Delete Failed',
          text2: 'Failed to remove translation',
          position: 'bottom',
        });
      }
    },
    [currentLanguage]
  );

  const clearAllTranslations = useCallback(async () => {
    try {
      await TranslationService.clearAllTranslations();
      setTranslatedBibles([]);

      const englishLang = SUPPORTED_LANGUAGES[0];
      setCurrentLanguageState(englishLang);
      await TranslationService.setCurrentLanguage(englishLang);

      Toast.show({
        type: 'success',
        text1: 'Translations Cleared',
        text2: 'All translations removed',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Failed to clear translations:', error);
      Toast.show({
        type: 'error',
        text1: 'Clear Failed',
        text2: 'Failed to clear translations',
        position: 'bottom',
      });
    }
  }, []);

  const setCurrentLanguage = useCallback(
    async (language: TranslationLanguage) => {
      try {
        setCurrentLanguageState(language);
        await TranslationService.setCurrentLanguage(language);
        console.log(`[useTranslation] Changed language to: ${language.name}`);
      } catch (error) {
        console.error('Failed to set current language:', error);
        Toast.show({
          type: 'error',
          text1: 'Language Change Failed',
          text2: 'Failed to change language',
          position: 'bottom',
        });
      }
    },
    []
  );

  const getCurrentBible = useCallback(():
    | BibleData
    | TranslatedBibleData
    | null => {
    if (currentLanguage.code === 'en') {
      return originalBible;
    }

    const translatedBible = translatedBibles.find(
      (bible) => bible.language.code === currentLanguage.code
    );

    return translatedBible || originalBible;
  }, [currentLanguage, originalBible, translatedBibles]);

  const getAvailableLanguages = useCallback((): TranslationLanguage[] => {
    // Always include English as it's the original
    const englishLang = SUPPORTED_LANGUAGES.find((lang) => lang.code === 'en');
    const availableLanguages = [englishLang].filter(
      Boolean
    ) as TranslationLanguage[];

    // Add translated languages
    translatedBibles.forEach((bible) => {
      if (
        !availableLanguages.some((lang) => lang.code === bible.language.code)
      ) {
        availableLanguages.push(bible.language);
      }
    });

    return availableLanguages;
  }, [translatedBibles]);

  const isLanguageAvailable = useCallback(
    (languageCode: string): boolean => {
      return (
        languageCode === 'en' ||
        translatedBibles.some((bible) => bible.language.code === languageCode)
      );
    },
    [translatedBibles]
  );

  return {
    // State
    translatedBibles,
    currentLanguage,
    translationProgress,
    isLoading,

    // Actions
    translateBible,
    deleteTranslation,
    clearAllTranslations,
    setCurrentLanguage,

    // Computed
    getCurrentBible,
    getAvailableLanguages,
    isLanguageAvailable,

    // Constants
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
};
