/**
 * Header.tsx
 * 
 * Header Component
 * 
 * A reusable header component that provides navigation and search functionality.
 * Features:
 * - Back navigation
 * - App logo display
 * - Search functionality
 * - Theme-aware styling
 */

import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './ThemedView';

/**
 * HeaderProps Interface
 * 
 * Props for the Header component
 * @property {string} [title='Tick Marker'] - The header title
 * @property {boolean} [showBack=false] - Whether to show the back button
 * @property {boolean} [showSearchIcon=false] - Whether to show the search icon
 * @property {string} [searchQuery=''] - The current search query
 * @property {function} [onSearchChange] - Callback function when search query changes
 */
export default function Header({
  title = 'Tick Marker',
  showBack = false,
  showSearchIcon = false,
  searchQuery = '',
  onSearchChange,
}: {
  title?: string;
  showBack?: boolean;
  showSearchIcon?: boolean;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
}) {
  // Navigation and theme hooks
  const navigation = useNavigation();
  const backgroundColor = useThemeColor({}, 'background');
  
  // Search state management
  const [showSearch, setShowSearch] = useState(false);

  /**
   * Toggles the search input visibility
   */
  const toggleSearch = () => setShowSearch(prev => !prev);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      
      {/* Back Navigation Button */}
      {showBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="gray" />
        </TouchableOpacity>
      )}

      {/* Center Content Container */}
      <View style={styles.centerContainer}>
        {showSearch ? (

          // Search Input
          <TextInput autoFocus placeholder="Search..." value={searchQuery} onChangeText={onSearchChange} 
          style={styles.input} />
        ) : (
          
          // App Logo
          <View style={styles.iconOnlyContainer}>
            <Image source={require('@/assets/images/app-logo.png')}style={styles.logo} />
          </View>
        )}
      </View>

      {/* Search Toggle Button */}
      {showSearchIcon && (
        <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
          <Ionicons name="search" size={22} color="gray" />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

/**
 * Component Styles
 * 
 * Defines the visual appearance of the Header component
 */
const styles = StyleSheet.create({
  // Main container styles
  container: {
    marginTop: 30,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
    
    // Shadow styles for elevation effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },

  // Back button styles
  backButton: {
    paddingRight: 10,
  },

  // Center content container styles
  centerContainer: {
    flex: 1,
    marginHorizontal: 10,
  },

  // Title container styles
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Logo styles
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  // Title text styles
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Search input styles
  input: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },

  // Icon button styles
  iconButton: {
    padding: 4,
  },

  // Logo container styles
  iconOnlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
