import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './ThemedView';


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
  const navigation = useNavigation();
  const backgroundColor = useThemeColor({}, 'background');
  const [showSearch, setShowSearch] = useState(false);
  

  const toggleSearch = () => setShowSearch(prev => !prev);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {showBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="gray" />
        </TouchableOpacity>
      )}

<View style={styles.centerContainer}>
  {showSearch ? (
    <TextInput
      autoFocus
      placeholder="Search..."
      value={searchQuery}
      onChangeText={onSearchChange}
      style={styles.input}
    />
  ) : (
    <View style={styles.iconOnlyContainer}>
      <Image 
        source={require('@/assets/images/app-logo.png')}
        style={styles.logo}
      />
    </View>
  )}
</View>


      {showSearchIcon && (
        <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
          <Ionicons name="search" size={22} color="gray" />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  backButton: {
    paddingRight: 10,
  },
  centerContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 4,
  },
  iconOnlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
});
