import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export default function Header({ title = 'Settings', showBack = false }: { title?: string; showBack?: boolean }) {
    const navigation = useNavigation();
    const backgroundColor = useThemeColor({}, 'background');

    return (
        <ThemedView style={[styles.container, { backgroundColor }]}>
            {showBack && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="gray" />
                </TouchableOpacity>
            )}

            <View style={styles.titleContainer}>
                <ThemedText type="title" style={styles.title}>
                {title}
                </ThemedText>
            </View>

            <View style={styles.spacer} />
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
  
      // Enhanced bottom shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 5,
    },
    backButton: {
      paddingRight: 10,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'flex-start',
    },
    title: {
      textAlign: 'left',
    },  
    spacer: {
      width: 34,
    },
  });
  