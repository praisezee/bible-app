import { Tabs } from 'expo-router';
import { useBible } from '@/contexts/BibleContext';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  const { settings } = useBible();
  const { colors } = useTheme(settings);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text + '80', // 50% opacity
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Read',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="bible" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="file-alt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="gear" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
