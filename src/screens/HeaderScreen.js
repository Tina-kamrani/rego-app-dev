import React from 'react';
import { View, StyleSheet } from 'react-native';
import AvatarTitle from '../components/AvatarTitle';
import SignalStrength from '../components/SignalStrength';
import { theme } from '../core/theme';

const HeaderScreen = ({ currentRoute }) => {
  return (
    <View style={styles.headerContainer}>
      <AvatarTitle />
      <SignalStrength />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.default,
    
    // Android Shadow
    elevation: 4,

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HeaderScreen;