import React, { useEffect } from 'react';
import { Provider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '@/src/core/theme';
import {
  LoginScreen,
  InitialScreen
} from '@/src/screens';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/src/core/i18n';
import { AuthProvider } from './authContext';
import { ReportProvider } from './reportContext';
import SplashScreen from '@/src/screens/SplashScreen';
import * as Linking from 'expo-linking';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const handleDeepLink = ({ url } : { url: any }) => {
      console.log("Received deep link:", url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ReportProvider>
          <Provider theme={theme}>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="InitialScreen" component={InitialScreen} />
            </Stack.Navigator>
          </Provider>
        </ReportProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}