import React from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { theme } from '@/src/core/theme';

export default function Background({ children }) {
  return (
    <ImageBackground
      source={require('@/assets/images/background_dot.png')}
      resizeMode="repeat"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.default,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: '10%',
    // justifyContent: 'center',
  },
});
