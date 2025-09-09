import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useBible } from '@/contexts/BibleContext';
import { useTheme } from '@/hooks/useTheme';
import { storageUtils } from '@/utils/storage';
import {
  Moon,
  Sun,
  Type,
  AlignLeft,
  Trash2,
  Info,
  Smartphone,
  Palette,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemeColorPicker from '@/components/ThemeColorPicker';

export default function SettingsScreen() {
  const { settings, updateSettings, syncStatus, manualSync } = useBible();
  const { colors, effectiveTheme } = useTheme(settings);
  const [showCustomThemeModal, setShowCustomThemeModal] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all your bookmarks, highlights, and notes. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await storageUtils.clearAllData();
            Alert.alert('Success', 'All user data has been cleared.');
          },
        },
      ]
    );
  };

  const formatLastSynced = (lastSynced: string | null): string => {
    if (!lastSynced || lastSynced === 'fallback') {
      return 'Mini Bible (offline)';
    }

    try {
      const date = new Date(lastSynced);
      return (
        date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch {
      return 'Unknown';
    }
  };
  const saveCustomTheme = (theme: any) => {
    updateSettings({
      theme: 'custom',
      customTheme: theme,
    });
    setShowCustomThemeModal(false);
  };

  const lineSpacingOptions = [
    { label: 'Tight', value: 1.2 },
    { label: 'Normal', value: 1.5 },
    { label: 'Relaxed', value: 1.8 },
    { label: 'Loose', value: 2.0 },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="pb-4 px-4 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Settings
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1">
        {/* Bible Sync Status */}
        <View
          className="p-4 rounded-lg mb-4"
          style={{ backgroundColor: colors.card }}
        >
          <View className="flex-row items-center mb-3">
            {syncStatus.isMini ? (
              <WifiOff size={24} color="#f59e0b" />
            ) : (
              <Wifi size={24} color="#10b981" />
            )}
            <Text
              className="ml-3 text-lg font-medium"
              style={{ color: colors.text }}
            >
              Bible Data
            </Text>
          </View>

          <View className="mb-3">
            <Text
              className="text-sm font-medium mb-1"
              style={{ color: colors.text + 'CC' }}
            >
              Status: {syncStatus.isMini ? 'Mini Bible' : 'Full Bible'}
            </Text>
            <Text className="text-sm" style={{ color: colors.text + 'AA' }}>
              Last synced: {formatLastSynced(syncStatus.lastSynced)}
            </Text>
          </View>
          {/* Theme Setting */}
          <View
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: colors.card }}
          >
            <Text
              className="text-lg font-medium mb-3"
              style={{ color: colors.text }}
            >
              Theme
            </Text>

            <TouchableOpacity
              className="flex-row items-center justify-between p-3 rounded-lg mb-2"
              style={{
                backgroundColor:
                  settings.theme === 'system'
                    ? colors.accent
                    : colors.background,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => updateSettings({ theme: 'system' })}
            >
              <View className="flex-row items-center flex-1">
                <Smartphone
                  size={24}
                  color={settings.theme === 'system' ? '#ffffff' : colors.text}
                />
                <View className="ml-3 flex-1">
                  <Text
                    className="font-medium"
                    style={{
                      color:
                        settings.theme === 'system' ? '#ffffff' : colors.text,
                    }}
                  >
                    System Theme
                  </Text>
                  <Text
                    className="text-sm"
                    style={{
                      color:
                        settings.theme === 'system'
                          ? '#ffffff' + 'CC'
                          : colors.text + 'CC',
                    }}
                  >
                    Follow device settings
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-3 rounded-lg mb-2"
              style={{
                backgroundColor:
                  settings.theme === 'light'
                    ? colors.accent
                    : colors.background,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => updateSettings({ theme: 'light' })}
            >
              <View className="flex-row items-center flex-1">
                <Sun
                  size={24}
                  color={settings.theme === 'light' ? '#ffffff' : '#f59e0b'}
                />
                <Text
                  className="ml-3 font-medium"
                  style={{
                    color: settings.theme === 'light' ? '#ffffff' : colors.text,
                  }}
                >
                  Light Mode
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-3 rounded-lg mb-2"
              style={{
                backgroundColor:
                  settings.theme === 'dark' ? colors.accent : colors.background,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => updateSettings({ theme: 'dark' })}
            >
              <View className="flex-row items-center flex-1">
                <Moon
                  size={24}
                  color={settings.theme === 'dark' ? '#ffffff' : '#fbbf24'}
                />
                <Text
                  className="ml-3 font-medium"
                  style={{
                    color: settings.theme === 'dark' ? '#ffffff' : colors.text,
                  }}
                >
                  Dark Mode
                </Text>
              </View>
            </TouchableOpacity>

            {/* Font Size Setting */}
            <View
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: colors.card }}
            >
              <View className="flex-row items-center mb-3">
                <Type size={24} color={colors.accent} />
                <Text
                  className="ml-3 text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  Font Size
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-sm" style={{ color: colors.text + 'CC' }}>
                  A
                </Text>
                <View className="flex-1 mx-4">
                  <View className="flex-row justify-between mb-2">
                    {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                      <TouchableOpacity
                        key={size}
                        className="px-3 py-2 rounded-lg"
                        style={{
                          backgroundColor:
                            settings.fontSize === size
                              ? colors.accent
                              : colors.card,
                        }}
                        onPress={() => updateSettings({ fontSize: size })}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{
                            color:
                              settings.fontSize === size
                                ? '#ffffff'
                                : colors.text,
                          }}
                        >
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text
                  className="text-lg font-bold"
                  style={{ color: colors.text + 'CC' }}
                >
                  A
                </Text>
              </View>
            </View>

            {/* Line Spacing Setting */}
            <View
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: colors.card }}
            >
              <View className="flex-row items-center mb-3">
                <AlignLeft size={24} color={colors.accent} />
                <Text
                  className="ml-3 text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  Line Spacing
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {lineSpacingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className="px-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor:
                        settings.lineSpacing === option.value
                          ? colors.accent
                          : colors.background,
                      borderColor:
                        settings.lineSpacing === option.value
                          ? colors.accent
                          : colors.border,
                    }}
                    onPress={() =>
                      updateSettings({ lineSpacing: option.value })
                    }
                  >
                    <Text
                      className="font-medium"
                      style={{
                        color:
                          settings.lineSpacing === option.value
                            ? '#ffffff'
                            : colors.text,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* App Info */}
            <View
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: colors.card }}
            >
              <View className="flex-row items-center mb-2">
                <Info size={24} color={colors.accent} />
                <Text
                  className="ml-3 text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  About
                </Text>
              </View>
              <Text className="text-sm" style={{ color: colors.text + 'CC' }}>
                Bible Version: King James Version (KJV)
              </Text>
              <Text className="text-sm" style={{ color: colors.text + 'CC' }}>
                Offline-first design ensures your data stays private and
                accessible
              </Text>
              <Text className="text-sm" style={{ color: colors.text + 'CC' }}>
                Current theme: {effectiveTheme}
              </Text>
            </View>

            {/* Clear Data */}
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-lg bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700"
              onPress={handleClearData}
            >
              <Trash2 size={24} color="#dc2626" />
              <View className="ml-3 flex-1">
                <Text className="text-red-600 font-medium">Clear All Data</Text>
                <Text className="text-red-500 text-sm">
                  Remove all bookmarks, highlights, and notes
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ThemeColorPicker
        visible={showCustomThemeModal}
        onClose={() => setShowCustomThemeModal(false)}
        onSave={saveCustomTheme}
        colors={colors}
        settings={settings}
      />
    </View>
  );
}
