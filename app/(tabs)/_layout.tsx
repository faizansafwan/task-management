/**
 * TabLayout.tsx
 * 
 * This component defines the bottom tab navigation structure using `expo-router`'s `Tabs` component.
 * It includes three main screens: Task List, Add Task, and Settings.
 * Each tab uses custom styling and optional platform-specific behavior.
 */


import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab'; // Custom tab button with haptic feedback
import { IconSymbol } from '@/components/ui/IconSymbol'; // Reusable icon component using SF Symbols
import TabBarBackground from '@/components/ui/TabBarBackground'; // Custom background for tab
import { Colors } from '@/constants/Colors'; // Centralized color constants
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook to detect current color scheme (dark/light)

export default function TabLayout() {

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{

        // Set the active tab color to match primary theme background
        tabBarActiveTintColor: Colors.primary.Background,

        // Hide headers across all screens in this tab navigator
        headerShown: false,

        // Use custom HapticTab component for enhanced tab press feedback
        tabBarButton: HapticTab,

        // Apply a custom background component
        tabBarBackground: TabBarBackground,


        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>

      {/* Task List Screen */}
      <Tabs.Screen name="list" options={{ title: 'Task List',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }} />

      {/* Add Task Screen */}
      <Tabs.Screen name="addTask" options={{ title: 'Add Task',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
      }} />

      {/* Settings Screen */}
      <Tabs.Screen name="settings" options={{  title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
      }} />

    </Tabs>
  );
}
