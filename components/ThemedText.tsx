/**
 * ThemedText.tsx
 * 
 * Themed Text Component
 * 
 * A wrapper component that extends React Native's Text component with theme support.
 * Provides consistent text styling across the application with support for different text types.
 * Features:
 * - Theme-aware text colors
 * - Predefined text styles
 * - Customizable text properties
 */

import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * ThemedTextProps Interface
 * 
 * Extends React Native's TextProps with theme-specific properties
 * @property {string} [lightColor] - Text color for light theme
 * @property {string} [darkColor] - Text color for dark theme
 * @property {('default'|'title'|'defaultSemiBold'|'subtitle'|'link')} [type='default'] - Predefined text style type
 * @extends {TextProps} - Inherits all standard Text component props
 */
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

/**
 * ThemedText Component
 * 
 * A theme-aware wrapper around React Native's Text component.
 * Provides consistent text styling with support for different text types.
 * 
 * @param {ThemedTextProps} props - Component props including theme colors, text type, and standard Text props
 * @returns {JSX.Element} A themed Text component
 * 
 * @example
 * // Basic usage with default style
 * <ThemedText>Regular text</ThemedText>
 * 
 * @example
 * // Usage with custom type and theme colors
 * <ThemedText type="title" lightColor="#000000" darkColor="#ffffff">
 *   Title Text
 * </ThemedText>
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  
  // Get the appropriate text color based on current theme
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

/**
 * Component Styles
 * 
 * Predefined text styles for different text types
 */
const styles = StyleSheet.create({

  // Default text style - Regular body text
  default: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Semi-bold text style - Emphasized body text
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },

  // Title text style - Main headings
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    lineHeight: 32,
  },

  // Subtitle text style - Section headings
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Link text style - Interactive text elements
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
