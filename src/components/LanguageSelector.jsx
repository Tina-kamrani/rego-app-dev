import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import i18n from '@/src/core/i18n';
import ExpoIcon from './ExpoIcon';
import { theme, dropDownTheme } from '../core/theme';

const languages = [
  { code: 'en', label: 'English(EN)' },
  { code: 'fi', label: 'Suomeksi(FI)' },
];

const LanguageSelector = ({ onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[1]);

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setSelectedLanguage(lng);
      onLanguageChange(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [onLanguageChange]);

  const handleSelectLanguage = (selectedItem) => {
    i18n.changeLanguage(selectedItem.code);
    setSelectedLanguage(selectedItem.code);
  };

  return (
    <View style={[styles.languageContainer, { backgroundColor: theme.colors.default }]}>
      <View style={styles.iconContainer}>
        <ExpoIcon name="globe" iconSet="Feather" color={theme.colors.text} />
      </View>
      <SelectDropdown
        data={languages}
        onSelect={(selectedItem) => handleSelectLanguage(selectedItem)}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View
              style={[
                styles.dropdownButtonStyle,
                { backgroundColor: theme.colors.lightPrimary },
              ]}
            >
              <Text style={[styles.dropdownButtonTxtStyle, { color: theme.colors.text }]}>              
                {selectedItem ? selectedItem.label : selectedLanguage.label}
              </Text>
              {isOpened ? (
                <ExpoIcon name="chevron-up" iconSet="Feather" color={theme.colors.text} />
              ) : (
                <ExpoIcon name="chevron-down" iconSet="Feather" color={theme.colors.text} />
              )}
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: theme.colors.secondaryContainer }),
                ...dropDownTheme.style,
              }}
            >
              <Text style={[styles.dropdownItemTxtStyle, dropDownTheme.labelStyle]}>
                {item.label}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={[styles.dropdownMenuStyle, { backgroundColor: theme.colors.default }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center', 
    paddingRight: 10, 
  },
  dropdownButtonStyle: {
    width: 180,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  dropdownMenuStyle: {
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
});

export default LanguageSelector;
