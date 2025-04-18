import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Logo() {
  return <Image source={require('@/assets/images/rego-logo.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
  },
});
