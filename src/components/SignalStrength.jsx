import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import i18n from '../core/i18n';
import ExpoIcon from './ExpoIcon';

const SignalStrength = () => {
  const [signalStrength, setSignalStrength] = useState(null);
  const [signalColor, setSignalColor] = useState('#DFE2EC');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        if (state.type === 'wifi' && state.details?.strength !== undefined) {
          setSignalStrength(state.details.strength);
        } else if (state.type === 'cellular') {
          const cellularStrength = getEstimatedCellularStrength(state.details.cellularGeneration);
          setSignalStrength(cellularStrength);
        }
      } else {
        setSignalStrength(0);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (signalStrength >= 70) {
      setSignalColor('#84E561');
    } else if (signalStrength >= 30) {
      setSignalColor('#84E561');
    } else if (signalStrength >= 1) {
      setSignalColor('#DFE2EC');
    } else {
      setSignalColor('#DFE2EC');
    }
  }, [signalStrength]);

  const getSignalIcon = () => {
    if (signalStrength >= 70) {
      return <ExpoIcon name="wifi-strength-4" iconSet="MaterialCommunityIcons" color="black" size={18} />;
    } else if (signalStrength >= 30) {
      return <ExpoIcon name="wifi-strength-2" iconSet="MaterialCommunityIcons" color="black" size={18} />;
    } else if (signalStrength >= 1) {
      return <ExpoIcon name="wifi-strength-1" iconSet="MaterialCommunityIcons" color="black" size={18} />;
    } else {
      return <ExpoIcon name="wifi-strength-off" iconSet="MaterialCommunityIcons" color="black" size={18} />;
    }
  };

  return (
    <View style={[styles.container, {'backgroundColor': signalColor}]}>
      {getSignalIcon()}
    </View>
  );
};

const getEstimatedCellularStrength = (generation) => {
  // Since NetInfo doesn't provide exact signal strength for cellular,
  // we approximate based on the network type
  switch (generation) {
    case '2g': return 20; // Very weak
    case '3g': return 40; // Moderate
    case '4g': return 70; // Strong
    case '5g': return 90; // Very strong
    default: return 10; // Unknown network type (fallback)
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 10,
  },
  signalText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SignalStrength;
