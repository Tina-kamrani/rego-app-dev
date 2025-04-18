import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Logo from '../components/Logo';
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { theme } from '../core/theme';

const SplashScreen = ({ navigation }) => {
    let [fontsLoaded] = useFonts({
      Inter_100Thin,
      Inter_200ExtraLight,
      Inter_300Light,
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
      Inter_800ExtraBold,
      Inter_900Black,
    });

    useEffect(() => {
      const timer = setTimeout(() => {
        navigation.replace('LoginScreen');
      }, 1000);
  
      return () => clearTimeout(timer);
    }, [navigation]);
    if (!fontsLoaded) {
      return ;
    } else {
    return (
        <View style={styles.container}>
          <Logo />
          <Text style={styles.title}>Tuuma App</Text>
        </View>
      );
    }
};
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.lightPrimary,
    },
    avatar: {
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Inter_600SemiBold',
      color: theme.colors.primary,
    },
});
  
export default SplashScreen;