import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { theme } from '@/src/core/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: theme.colors.default, dark: theme.colors.default }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
