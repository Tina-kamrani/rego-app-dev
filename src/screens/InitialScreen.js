import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, SafeAreaView, View, Text, StatusBar } from 'react-native';
import ExpoIcon from '../components/ExpoIcon';

import HeaderScreen from '@/src/screens/HeaderScreen';
import ReportScreen from '@/src/screens/ReportScreen';
// import ScheduleScreen from '@/src/screens/ScheduleScreen';
import SafetyScreen from '@/src/screens/SafetyScreen';
import LogoutScreen from '@/src/screens/LogoutScreen';
import SuccessMessageScreen from '@/src/screens/SuccessMessageScreen';
import CameraPreview from '@/src/components/CameraPreview';
import i18n from '../core/i18n';
import Toast from 'react-native-toast-message';
import ReportDetailScreen from '@/src/screens/ReportDetailScreen';
import SafetyFindingScreen from '@/src/screens/SafetyFindingScreen';
import ReportDangerScreen from '@/src/screens/ReportDangerScreen';
import SecurityBreachScreen from '@/src/screens/SecurityBreachScreen';
import { theme, systemColorScheme } from '../core/theme';
import { Portal } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MyReportStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='ReportScreen'
    >
      <Stack.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SafetyFindingScreen"
        component={SafetyFindingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ReportDangerScreen"
        component={ReportDangerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SecurityBreachScreen"
        component={SecurityBreachScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name='SuccessMessageScreen'
        component={SuccessMessageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name='CameraPreview'
        component={CameraPreview}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};

const getTabIcon = (routeKey, isActive) => {
  switch (routeKey) {
    case 'Dashboard':
      return <ExpoIcon name="home" iconSet="Feather" size={24} color={ isActive ? 'white' : theme.colors.primary } />;
    // case 'MyReports':
    //   return <ExpoIcon name="message1" iconSet="AntDesign" size={24} color={theme.colors.secondary} />;
    case 'Schedule':
      return <ExpoIcon name="calendar" iconSet="Feather" size={24} color={ isActive ? 'white' : theme.colors.primary } />;
    case 'Logout':
        return <ExpoIcon name="logout" iconSet="MaterialIcons" size={24} color={ isActive ? 'white' : theme.colors.primary } />;
    default:
      return null;
  }
};

export default function InitialScreen() {
  const [networkstate, setNetworkstate] = useState();
  
  useEffect(() => {
    const getNetworkState = async () => {
      setNetworkstate(await AsyncStorage.getItem("networkstatus"));
    }

    getNetworkState();
  }, []);

  const handleMockNetworkOnOff = async () => {
    const newval = networkstate === 'on' ? 'off' : 'on';
    await AsyncStorage.setItem('networkstatus', newval);
    setNetworkstate(newval);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={ theme.colors.default } barStyle={systemColorScheme === "light" ? "dark-content" : "light-content"} />
      <HeaderScreen />
      <Portal><Toast /></Portal>
      {/* <TouchableOpacity onPress={handleMockNetworkOnOff}>
        <Text>{networkstate}</Text></TouchableOpacity> */}
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const isActive = focused;
            return (
              <View style={isActive ? styles.activeTab : styles.inactiveTab}>
                {getTabIcon(route.name, isActive)}
                <Text style={{color: isActive ? 'white' : theme.colors.primary}}>
                  {route.name === 'Dashboard' ? i18n.t('dashboard') : route.name === 'MyReports' ? i18n.t('myreports') : i18n.t('logout')}
                </Text>
              </View>
            );
          },
          tabBarShowLabel: false,
          tabBarStyle: styles.bottomNavigation,
          headerShown: false
        })}
        initialRouteName="Dashboard"
      >
        <Tab.Screen 
            name="Dashboard"
            component={MyReportStack}
        />
        <Tab.Screen 
            name="Logout" 
            component={LogoutScreen}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: theme.colors.default,
    },
    bottomNavigation: {
      backgroundColor: theme.colors.default,
      borderTopWidth: 1,
      borderTopColor: '#DFE2EC',
      height: 70
    },
    activeTab: {
      width: 104,
      height: 65,
      backgroundColor: theme.colors.secondaryContainer,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inactiveTab: {
      width: 104,
      height: 65,
      backgroundColor: theme.colors.default,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabLabel: {
      fontSize: 12,
      marginTop: 5,
      fontWeight: '500',
    },
});