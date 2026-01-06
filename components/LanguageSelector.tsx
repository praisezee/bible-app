import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, Globe } from 'lucide-react-native';
import { TranslationLanguage } from '@/types/translationTypes';
import { useTheme } from '@/hooks/useTheme';
import { AppSettings } from '@/types/bible';

interface LanguageSelectorProps {
  currentLanguage: TranslationLanguage;
  onPress: () => void;
  settings: AppSettings;
}

export default function LanguageSelector({
  currentLanguage,
  onPress,
  settings,
}: LanguageSelectorProps) {
  const { colors } = useTheme(settings);

  return (
    <TouchableOpacity
      className="flex-row items-center px-3 py-2 rounded-lg"
      style={{ backgroundColor: colors.card }}
      onPress={onPress}
    >
      <Globe size={16} color={colors.accent} />
      <Text className="text-lg mr-1 ml-2">{currentLanguage.flag}</Text>
      <Text
        className="font-medium mr-2"
        style={{ color: colors.text, fontSize: 14 }}
      >
        {currentLanguage.code.toUpperCase()}
      </Text>
      <ChevronDown size={16} color={colors.text + 'AA'} />
    </TouchableOpacity>
  );
}
