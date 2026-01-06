import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { X, Download, Trash2, Globe, Check } from 'lucide-react-native';
import ModernModal from './ModernModal';
import { useTheme } from '@/hooks/useTheme';
import { AppSettings } from '@/types/bible';
import {
  TranslationLanguage,
  TranslationProgress,
} from '@/types/translationTypes';
import * as Progress from 'react-native-progress';

interface TranslationModalProps {
  visible: boolean;
  onClose: () => void;
  settings: AppSettings;
  supportedLanguages: TranslationLanguage[];
  availableLanguages: TranslationLanguage[];
  currentLanguage: TranslationLanguage;
  translationProgress: TranslationProgress;
  onTranslate: (language: TranslationLanguage) => void;
  onDelete: (languageCode: string) => void;
  onLanguageChange: (language: TranslationLanguage) => void;
  onClearAll: () => void;
}

export default function TranslationModal({
  visible,
  onClose,
  settings,
  supportedLanguages,
  availableLanguages,
  currentLanguage,
  translationProgress,
  onTranslate,
  onDelete,
  onLanguageChange,
  onClearAll,
}: TranslationModalProps) {
  const { colors } = useTheme(settings);
  const [activeTab, setActiveTab] = useState<'available' | 'download'>(
    'available'
  );

  const handleDelete = (languageCode: string, languageName: string) => {
    if (languageCode === 'en') return; // Can't delete original

    Alert.alert(
      'Delete Translation',
      `Are you sure you want to delete the ${languageName} translation? This will free up storage space.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(languageCode),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Translations',
      'This will delete all downloaded translations and free up storage space. The original Bible will remain.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: onClearAll,
        },
      ]
    );
  };

  const renderAvailableLanguage = ({ item }: { item: TranslationLanguage }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 rounded-2xl mb-3"
      style={{ backgroundColor: colors.card }}
      onPress={() => onLanguageChange(item)}
    >
      <View className="flex-row items-center flex-1">
        <Text className="text-2xl mr-3">{item.flag}</Text>
        <View className="flex-1">
          <Text
            className="font-semibold text-base"
            style={{ color: colors.text }}
          >
            {item.nativeName}
          </Text>
          <Text className="text-sm" style={{ color: colors.text + 'CC' }}>
            {item.name}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center">
        {currentLanguage.code === item.code && (
          <Check size={20} color={colors.accent} />
        )}
        {item.code !== 'en' && (
          <TouchableOpacity
            className="ml-3 p-2"
            onPress={() => handleDelete(item.code, item.name)}
          >
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderDownloadLanguage = ({ item }: { item: TranslationLanguage }) => {
    const isAvailable = availableLanguages.some(
      (lang) => lang.code === item.code
    );

    // Don't show languages that are already available
    if (isAvailable) return null;

    return (
      <TouchableOpacity
        className="flex-row items-center justify-between p-4 rounded-2xl mb-3"
        style={{
          backgroundColor: colors.card,
          opacity: translationProgress.isTranslating ? 0.6 : 1,
        }}
        onPress={() => onTranslate(item)}
        disabled={translationProgress.isTranslating}
      >
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-3">{item.flag}</Text>
          <View className="flex-1">
            <Text
              className="font-semibold text-base"
              style={{ color: colors.text }}
            >
              {item.nativeName}
            </Text>
            <Text className="text-sm" style={{ color: colors.text + 'CC' }}>
              {item.name}
            </Text>
          </View>
        </View>

        <Download size={20} color={colors.accent} />
      </TouchableOpacity>
    );
  };

  return (
    <ModernModal
      visible={visible}
      onClose={onClose}
      settings={settings}
      size="fullscreen"
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          Bible Translations
        </Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={colors.text + 'AA'} />
        </TouchableOpacity>
      </View>

      {/* Translation Progress */}
      {translationProgress.isTranslating && (
        <View
          className="mb-6 p-4 rounded-2xl"
          style={{ backgroundColor: colors.card }}
        >
          <View className="flex-row items-center mb-3">
            <Globe size={20} color={colors.accent} />
            <Text className="ml-2 font-semibold" style={{ color: colors.text }}>
              Translating Bible...
            </Text>
          </View>

          <Progress.Bar
            progress={translationProgress.progress / 100}
            width={null}
            height={8}
            color={colors.accent}
            unfilledColor={colors.border}
            borderWidth={0}
            borderRadius={4}
            style={{ flex: 1 }}
          />

          <View className="flex-row justify-between mt-2">
            <Text className="text-sm" style={{ color: colors.text + 'CC' }}>
              {translationProgress.currentBook}{' '}
              {translationProgress.currentChapter > 0 &&
                `${translationProgress.currentChapter}`}
            </Text>
            <Text className="text-sm" style={{ color: colors.text + 'CC' }}>
              {Math.round(translationProgress.progress)}%
            </Text>
          </View>
        </View>
      )}

      {/* Tab Selector */}
      <View
        className="flex-row rounded-lg p-1 mb-4"
        style={{ backgroundColor: colors.card }}
      >
        <TouchableOpacity
          className="flex-1 py-2 px-4 rounded-md"
          style={{
            backgroundColor:
              activeTab === 'available' ? colors.accent : 'transparent',
          }}
          onPress={() => setActiveTab('available')}
        >
          <Text
            className="text-center font-medium"
            style={{
              color: activeTab === 'available' ? '#ffffff' : colors.text + 'AA',
            }}
          >
            Available ({availableLanguages.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-2 px-4 rounded-md"
          style={{
            backgroundColor:
              activeTab === 'download' ? colors.accent : 'transparent',
          }}
          onPress={() => setActiveTab('download')}
        >
          <Text
            className="text-center font-medium"
            style={{
              color: activeTab === 'download' ? '#ffffff' : colors.text + 'AA',
            }}
          >
            Download More
          </Text>
        </TouchableOpacity>
      </View>

      {/* Language List */}
      <View className="flex-1 border border-red-500">
        {activeTab === 'available' ? (
          <>
            {availableLanguages.length > 0 ? (
              <View>
                <FlatList
                  data={availableLanguages}
                  keyExtractor={(item) => item.code}
                  renderItem={renderAvailableLanguage}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : (
              <View className="items-center py-8 h-full">
                <Globe size={48} color={colors.text + '40'} />
                <Text
                  className="mt-4 text-center"
                  style={{ color: colors.text + 'AA' }}
                >
                  No translations available
                </Text>
                <Text
                  className="mt-2 text-center px-4"
                  style={{ color: colors.text + '80' }}
                >
                  Download translations from the "Download More" tab
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            {supportedLanguages.filter(
              (lang) =>
                !availableLanguages.some((avail) => avail.code === lang.code)
            ).length > 0 ? (
              <View>
                <FlatList
                  data={supportedLanguages.filter(
                    (lang) =>
                      !availableLanguages.some(
                        (avail) => avail.code === lang.code
                      )
                  )}
                  keyExtractor={(item) => item.code}
                  renderItem={renderDownloadLanguage}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : (
              <View className="items-center h-full py-8">
                <Check size={48} color={colors.accent} />
                <Text
                  className="mt-4 text-center"
                  style={{ color: colors.text + 'AA' }}
                >
                  All languages downloaded!
                </Text>
                <Text
                  className="mt-2 text-center px-4"
                  style={{ color: colors.text + '80' }}
                >
                  You have downloaded all available translations
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Clear All Button */}
      {availableLanguages.length > 1 && (
        <TouchableOpacity
          className="flex-row items-center justify-center p-4 rounded-2xl mt-4"
          style={{
            backgroundColor: '#fee2e2',
            borderColor: '#fecaca',
            borderWidth: 1,
          }}
          onPress={handleClearAll}
        >
          <Trash2 size={20} color="#dc2626" />
          <Text className="ml-2 font-semibold" style={{ color: '#dc2626' }}>
            Clear All Translations
          </Text>
        </TouchableOpacity>
      )}
    </ModernModal>
  );
}
