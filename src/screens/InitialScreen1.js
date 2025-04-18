import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import {
  WelcomeScreen,
  ReportScreen,
  ReportDetailScreen,
  SuccessScreen
} from '@/src/screens';

import LogoTitle from '../components/LogoTitle';
import AvatarTitle from '../components/AvatarTitle';
import SignalStrength from '../components/SignalStrength';

const Stack = createStackNavigator();

export default function InitialScreen1() {
    return (
      <>
        <Stack.Navigator>
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{ 
                headerTitle: () => <AvatarTitle />,
                headerRight: () => <SignalStrength />,
            }}
          />
          <Stack.Screen 
            name="ReportScreen"
            component={ReportScreen}
            options={{ 
                headerLeft: null,
                headerTitle: () => <LogoTitle />,
                headerRight: () => <AvatarTitle />,
            }}
          />
          <Stack.Screen 
            name="ReportDetailScreen"
            component={ReportDetailScreen}
            options={{ 
                headerLeft: null,
                headerTitle: () => <LogoTitle />,
                headerRight: () => <AvatarTitle />,
            }}
          />
          <Stack.Screen 
            name="SuccessScreen"
            component={SuccessScreen}
            options={{ 
                headerLeft: null,
                headerTitle: () => <LogoTitle />,
                headerRight: () => <AvatarTitle />,
            }}
          />
        </Stack.Navigator>
        <Toast />
      </>
    );
};
