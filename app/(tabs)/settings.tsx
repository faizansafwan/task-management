import Header from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/contexts/ThemeContext'; // ← NEW
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View
} from 'react-native';

export default function Settings() {
  const { theme, setTheme } = useAppTheme(); // ← NEW
  const isDarkMode = theme === 'dark';       // ← UPDATED
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark'); // ← UPDATED
    Alert.alert('Theme toggled', `Switched to ${isDarkMode ? 'Light' : 'Dark'} Mode`);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const clearAllTasks = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete all tasks?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => console.log('Tasks cleared') },
    ]);
  };

  const contactDeveloper = () => {
    Linking.openURL('mailto:fai.saf010@gmail.com');
  };

  return (
    
    <ScrollView style={styles.page}>
      <Header title="Settings" />

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Appearance</ThemedText>
        <View style={styles.row}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Reminders</ThemedText>
        <View style={styles.row}>
          <ThemedText>Enable Notifications</ThemedText>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
  <ThemedText type="subtitle">General</ThemedText>
  <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={clearAllTasks}>
    <ThemedText style={styles.buttonText}>Clear All Tasks</ThemedText>
  </TouchableOpacity>
</ThemedView>

<ThemedView style={styles.section}>
  <ThemedText type="subtitle">App Info</ThemedText>
  <ThemedText>Version: 1.0.0</ThemedText>
  <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={contactDeveloper}>
    <ThemedText style={styles.buttonText}>Contact Developer</ThemedText>
  </TouchableOpacity>
</ThemedView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  page: {
    marginTop: 0,
  },
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
