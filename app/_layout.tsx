import '../global.css';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { BibleProvider } from '@/contexts/BibleContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ImageBackground, View } from 'react-native';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  SplashScreen.hideAsync();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAppReady(true);
    }
    prepare();
  }, []);

  if (!appReady) {
    return (
      <View className="flex-1">
        <ImageBackground
          source={require('../assets/images/splash.png')}
          className="flex-1"
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <BibleProvider>
        <GestureHandlerRootView>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
          <Toast />
        </GestureHandlerRootView>
      </BibleProvider>
    </SafeAreaProvider>
  );
}
