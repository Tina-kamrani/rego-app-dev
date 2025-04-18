import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import ExpoIcon from "./ExpoIcon";
import { theme } from "../core/theme";

export default function IconLongButton({ iconName = "", iconSet = "", label = "", onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.leftContainer}>
        <ExpoIcon name={iconName} iconSet={iconSet} size={30} color={'white'} />
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.rightContainer}>
        <ExpoIcon name="chevron-right" iconSet="Feather" size={24} color={'white'} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.secondaryContainer,
    backgroundColor: theme.colors.primary,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  middleContainer: {
    flex: 4,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  }
});