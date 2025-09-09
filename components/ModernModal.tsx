import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { AppSettings } from '@/types/bible';

interface ModernModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  settings: AppSettings;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

export default function ModernModal({
  visible,
  onClose,
  children,
  settings,
  size = 'medium',
}: ModernModalProps) {
  const { colors, isDark } = useTheme(settings);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0.9, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return 'w-80 max-h-64';
      case 'medium':
        return 'w-80 max-h-96';
      case 'large':
        return 'w-96 max-h-[32rem]';
      case 'fullscreen':
        return 'flex-1 mx-4 my-20';
      default:
        return 'w-80 max-h-96';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          activeOpacity={1}
          onPress={onClose}
        >
          <BlurView
            intensity={isDark ? 20 : 40}
            tint={isDark ? 'dark' : 'light'}
            className="absolute inset-0"
          />

          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View
              className={`rounded-3xl p-6 mx-4 ${getModalSize()}`}
              style={[
                {
                  backgroundColor: colors.background,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 20,
                  elevation: 20,
                  borderWidth: 1,
                  borderColor: colors.border + '40',
                },
                animatedStyle,
              ]}
            >
              {children}
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
