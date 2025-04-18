import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const Option = ({ selected, title, width, onPress, index }) => {
  const handlePress = () => {
    if (typeof onPress === 'function') {
      onPress(index);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: selected ? 'lightgray' : 'white', width }]}
      onPress={handlePress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    padding: 16,
  },
  text: {
    fontSize: 17,
  },
});

export default Option;