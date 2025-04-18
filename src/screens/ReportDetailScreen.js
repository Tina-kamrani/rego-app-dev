import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import SafetyFindingScreen from './SafetyFindingScreen';
import ReportDangerScreen from './ReportDangerScreen';

export default function ReportDetailScreen({ route, navigation }) {
    const { path } = route.params;

    return (
        <ParallaxScrollView>
          {
            path == 2 ? <SafetyFindingScreen navigation={navigation} path={ path } /> : <ReportDangerScreen navigation={navigation} path={ path } />
          }
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    }
});