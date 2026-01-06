import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import ModernModal from './ModernModal';
import ColorPickerComponent from './ColorPickerComponent';
import { AppSettings } from '@/types/bible';

interface ThemeColorPickerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (theme: any) => void;
  colors: any;
  settings: AppSettings;
}

export default function ThemeColorPicker({
  visible,
  onClose,
  onSave,
  colors,
  settings,
}: ThemeColorPickerProps) {
  const [customTheme, setCustomTheme] = useState({
    name: 'My Theme',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    cardColor: '#1f2937',
    borderColor: '#374151',
    accentColor: '#3b82f6',
  });
  const [activeColorProperty, setActiveColorProperty] = useState<string | null>(
    null
  );

  const handleSave = () => {
    onSave(customTheme);
    onClose();
  };

  const updateThemeColor = (property: string, value: string) => {
    setCustomTheme((prev) => ({ ...prev, [property]: value }));
    setActiveColorProperty(null);
  };

  const colorProperties = [
    { key: 'backgroundColor', label: 'Background Color', icon: '🎨' },
    { key: 'textColor', label: 'Text Color', icon: '📝' },
    { key: 'cardColor', label: 'Card Color', icon: '🃏' },
    { key: 'borderColor', label: 'Border Color', icon: '🔲' },
    { key: 'accentColor', label: 'Accent Color', icon: '✨' },
  ];

  return (
    <>
      <ModernModal
        visible={visible}
        onClose={onClose}
        settings={settings}
        size="large"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Create Custom Theme
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.text + 'AA'} />
          </TouchableOpacity>
        </View>

        <TextInput
          className="p-4 rounded-2xl mb-6 border text-base"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          }}
          placeholder="Theme name"
          placeholderTextColor={colors.text + '80'}
          value={customTheme.name}
          onChangeText={(text) =>
            setCustomTheme((prev) => ({ ...prev, name: text }))
          }
        />

        <ScrollView
          className="max-h-64 mb-6"
          showsVerticalScrollIndicator={false}
        >
          {colorProperties.map((property) => (
            <TouchableOpacity
              key={property.key}
              className="flex-row items-center justify-between p-4 rounded-2xl mb-3"
              style={{ backgroundColor: colors.card }}
              onPress={() => (
                setActiveColorProperty(property.key), console.log(property.key)
              )}
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-lg mr-3">{property.icon}</Text>
                <Text
                  className="font-semibold text-base"
                  style={{ color: colors.text }}
                >
                  {property.label}
                </Text>
              </View>
              <View
                className="w-8 h-8 rounded-full border-2"
                style={{
                  backgroundColor:
                    customTheme[property.key as keyof typeof customTheme],
                  borderColor: colors.border,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 p-4 rounded-2xl"
            style={{ backgroundColor: colors.accent }}
            onPress={handleSave}
          >
            <Text className="text-white text-center font-semibold text-base">
              Save Theme
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 p-4 rounded-2xl"
            style={{ backgroundColor: colors.card }}
            onPress={onClose}
          >
            <Text
              className="text-center font-semibold text-base"
              style={{ color: colors.text }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ModernModal>

      {/* Color Picker Modal */}
      <ModernModal
        visible={activeColorProperty !== null}
        onClose={() => setActiveColorProperty(null)}
        settings={settings}
        size="large"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Select{' '}
            {colorProperties.find((p) => p.key === activeColorProperty)?.label}
          </Text>
          <TouchableOpacity onPress={() => setActiveColorProperty(null)}>
            <X size={24} color={colors.text + 'AA'} />
          </TouchableOpacity>
        </View>

        <ColorPickerComponent
          selectedColor={
            customTheme[
              activeColorProperty as keyof typeof customTheme
            ] as string
          }
          onColorChange={(color) =>
            updateThemeColor(activeColorProperty!, color)
          }
          colors={colors}
        />

        <TouchableOpacity
          className="p-4 rounded-2xl mt-6"
          style={{ backgroundColor: colors.accent }}
          onPress={() => setActiveColorProperty(null)}
        >
          <Text className="text-white text-center font-semibold text-base">
            Done
          </Text>
        </TouchableOpacity>
      </ModernModal>
    </>
  );
}
