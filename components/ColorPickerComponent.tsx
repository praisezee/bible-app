import React, { useState, useMemo } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  Panel1,
  Preview,
  OpacitySlider,
} from 'reanimated-color-picker';

interface ColorPickerComponentProps {
  selectedColor: string;
  onColorChange: (color: string) => void; // fires continuously
  onColorSelected?: (color: string) => void; // fires once on release
  colors: {
    border: string;
    text: string;
  };
}

export default function ColorPickerComponent({
  selectedColor,
  onColorChange,
  onColorSelected,
  colors,
}: ColorPickerComponentProps) {
  const [tempColor, setTempColor] = useState(selectedColor);

  // keep picker size stable
  const pickerSize = useMemo(
    () => Math.min(Dimensions.get('window').width - 100, 250),
    []
  );

  // memoized styles to avoid new objects on every render
  const sliderStyle = useMemo(() => styles.slider, []);
  const flexStyle = useMemo(() => styles.flex, []);

  return (
    <View className="items-center">
      <View style={{ width: pickerSize, height: pickerSize }} className="mb-5">
        <ColorPicker
          style={flexStyle}
          value={tempColor}
          onChange={(color) => {
            setTempColor(color.hex);
            onColorChange(color.hex);
          }}
          onComplete={(color) => {
            onColorSelected?.(color.hex);
          }}
        >
          <Preview hideInitialColor style={{ marginBottom: 5 }} />
          <Panel1 style={flexStyle} />
          <BrightnessSlider style={sliderStyle} />
          <OpacitySlider style={sliderStyle} />
        </ColorPicker>
      </View>

      {/* Current color preview */}
      <View
        className="w-16 h-16 rounded-2xl border-2 mb-4"
        style={{
          backgroundColor: tempColor,
          borderColor: colors.border,
        }}
      />

      <Text
        className="text-sm font-medium"
        style={{ color: colors.text + 'CC' }}
      >
        Selected Color: {tempColor.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  slider: { marginTop: 10 },
});
