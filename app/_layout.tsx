/**
 * _layout.tsx
 * 
 * Root Layout Component
 * 
 * This is the root layout component that wraps the entire application.
 * It handles:
 * - Theme management (dark/light mode)
 * - Font loading
 * - Navigation setup
 * - Push notification registration
 * - Status bar configuration
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { ThemeProviderCustom, useAppTheme } from '@/contexts/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { registerForPushNotificationsAsync } from '@/lib/notification';

/**
 * RootLayout Component
 * 
 * The main layout component that initializes the app.
 * Handles font loading and wraps the app with theme provider.
 * 
 * @returns {JSX.Element | null} The root layout component or null if fonts aren't loaded
 */
export default function RootLayout() {
  // Get system color scheme preference
  const colorScheme = useColorScheme();

  // Load custom fonts
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Return null while fonts are loading
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProviderCustom>
      <AppContent />
    </ThemeProviderCustom>
  );
}

/**
 * AppContent Component
 * 
 * Inner component that handles:
 * - Theme application
 * - Push notification registration
 * - Navigation stack setup
 * - Status bar configuration
 * 
 * @returns {JSX.Element} The themed app content with navigation
 */
function AppContent() {
  // Get current theme from context
  const { theme } = useAppTheme();

  // Register for push notifications on component mount
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Navigation Stack */}
      <Stack>
        {/* Main tab navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* 404 screen for unmatched routes */}
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* Status bar that adapts to theme */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
