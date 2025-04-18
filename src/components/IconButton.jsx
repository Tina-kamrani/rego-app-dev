import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import ExpoIcon from './ExpoIcon';

export default function IconButton({ iconName, iconSet, title, onPress, width='45%', borderStyle='solid' }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { width }, {borderStyle}]}>
      <ExpoIcon name={iconName} iconSet={iconSet} size={30} color="#000" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 100,
    margin: '2%',
    borderWidth: 1,
    borderColor: '#aaaaaa',
  },
  icon: {
    width: 60,
    height: 30,
    marginBottom: 5,
    textAlign: 'center'
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});