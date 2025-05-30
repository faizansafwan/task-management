/**
 * settings.tsx
 * 
 * Settings Screen Component
 * 
 * This component provides user settings and preferences management.
 * Features include:
 * - Theme switching (Dark/Light mode)
 * - Push notification management
 * - Task management (Clear all tasks)
 * - App information and developer contact
 */

import Header from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/contexts/ThemeContext';
import { deleteTask, getTaskList } from '@/lib/api';
import { registerForPushNotificationsAsync } from '@/lib/notification';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function Settings() {
  // Theme state management
  const { theme, setTheme } = useAppTheme();
  const isDarkMode = theme === 'dark';

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  /**
   * Toggles between dark and light theme
   * Updates the app theme and shows a confirmation alert
   */
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
    Alert.alert('Theme toggled', `Switched to ${isDarkMode ? 'Light' : 'Dark'} Mode`);
  };

  /**
   * Toggles push notifications
   * Registers for push notifications if enabling
   * Shows appropriate confirmation alerts
   */
  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
  
    if (newValue) {
      await registerForPushNotificationsAsync();
      Alert.alert('Notifications Enabled', "You'll receive reminders for tasks.");
    } else {
      Alert.alert('Notifications Disabled', "You won't receive reminders.");
    }
  };

  /**
   * Clears all tasks from the application
   * Shows confirmation dialog before deletion
   * Handles success and error cases with appropriate alerts
   */
  const clearAllTasks = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete all tasks?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const tasks = await getTaskList();
            const taskIds = tasks.map((task: any) => task.id);

            await Promise.all(taskIds.map((id: string) => deleteTask(id)));

            Alert.alert('Success', 'All tasks have been deleted.');
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete some or all tasks.');
          }
        },
      },
    ]);
  };

  /**
   * Opens the default email client to contact the developer
   */
  const contactDeveloper = () => {
    Linking.openURL('mailto:fai.saf010@gmail.com');
  };

  return (
    <View style={styles.container}>
      
      {/* App Header */}
      <Header />

      {/* Scrollable Settings Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Appearance Settings Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Appearance</ThemedText>

          {/* Dark Mode Toggle */}
          <View style={styles.row}>
            <ThemedText>Dark Mode</ThemedText>
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          </View>
        </ThemedView>

        {/* Notification Settings Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Reminders</ThemedText>

          {/* Notification Toggle */}
          <View style={styles.row}>
            <ThemedText>Enable Notifications</ThemedText>
            <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
          </View>
        </ThemedView>

        {/* Task Management Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">General</ThemedText>

          {/* Clear All Tasks Button */}
          <TouchableOpacity  style={[styles.button, styles.primaryButton]} onPress={clearAllTasks} >
            <ThemedText style={styles.buttonText}>Clear All Tasks</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* App Information Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">App Info</ThemedText>
          <ThemedText>Version: 1.0.0</ThemedText>
         
          {/* Contact Developer Button */}
          <TouchableOpacity  style={[styles.button, styles.secondaryButton]} 
            onPress={contactDeveloper} >
            <ThemedText style={styles.buttonText}>Contact Developer</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

/**
 * Styles for the Settings screen
 * Includes layout, colors, and component-specific styling
 */
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Section styles
  section: {
    padding: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Button styles
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary.Background,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary.Background,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
