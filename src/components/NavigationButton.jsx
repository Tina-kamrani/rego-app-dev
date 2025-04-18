import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import ExpoIcon from './ExpoIcon';
import i18n from "../core/i18n";



const NavigationButton = ({ text, onPress, iconName, iconSet, iconPosition = 'left', style, disabled = false }) => (
  <TouchableOpacity
    onPress={!disabled ? onPress : null}
    style={[styles.button, style, disabled && styles.disabledButton]}
  >
    {iconPosition === 'left' && (
      <ExpoIcon
        name={iconName}
        iconSet={iconSet}
        color={disabled ? "#ccc" : "#fff"}
        size={18}
        style={[styles.icon, { marginRight: 10 }]}
      />
    )}
    <Text style={[styles.text, disabled && styles.disabledText]}>{text}</Text>
    {iconPosition === 'right' && (
      <ExpoIcon
        name={iconName}
        iconSet={iconSet}
        color={disabled ? "#ccc" : "#fff"}
        size={18}
        style={[styles.icon, { marginLeft: 10 }]}
      />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4BB543',
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 10,
    minWidth: 100,
    maxHeight: 40,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  icon: {
    margin: 0,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  disabledText: {
    color: '#a9a9a9',
  },
});

export const PrevButton = ({ onPress, disabled }) => (
  <NavigationButton
    text={` ${i18n.t('Back')} `}
    onPress={onPress}
    disabled={disabled}
  />
);

export const ContinueButton = ({ onPress, disabled }) => (
  <NavigationButton
    text={` ${i18n.t('Continue')} `}
    onPress={onPress}
    disabled={disabled}
  />
);

export const SubmitButton = ({ onPress, disabled }) => (
  <NavigationButton
  text={` ${i18n.t('Submit')} `}
    onPress={onPress}
    disabled={disabled}
  />
);
