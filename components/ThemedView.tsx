/**
 * ThemedView.tsx
 * 
 * Themed View Component
 * 
 * A wrapper component that extends React Native's View component with theme support.
 * It automatically handles background color based on the current theme (light/dark).
 * This component is used throughout the app to maintain consistent theming.
 */

import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * ThemedViewProps Interface
 * 
 * Extends React Native's ViewProps with theme-specific properties
 * @property {string} [lightColor] - Background color for light theme
 * @property {string} [darkColor] - Background color for dark theme
 * @extends {ViewProps} - Inherits all standard View component props
 */
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

/**
 * ThemedView Component
 * 
 * A theme-aware wrapper around React Native's View component.
 * Automatically applies the appropriate background color based on the current theme.
 * 
 * @param {ThemedViewProps} props - Component props including theme colors and standard View props
 * @returns {JSX.Element} A themed View component
 * 
 * @example
 * // Basic usage with default theme colors
 * <ThemedView>
 *   <Text>Content</Text>
 * </ThemedView>
 * 
 * @example
 * // Usage with custom theme colors
 * <ThemedView lightColor="#ffffff" darkColor="#000000">
 *   <Text>Content</Text>
 * </ThemedView>
 */
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
