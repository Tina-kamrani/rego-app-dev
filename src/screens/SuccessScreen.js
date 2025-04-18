import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SuccessMessageScreen from './SuccessMessageScreen';
import SuccessNewFormScreen from './SuccessNewFormScreen';
import ExpoIcon from '../components/ExpoIcon';

export default function SuccessScreen({ route, navigation }) {
    const { iconName, title } = route.params;

    return (
        <ParallaxScrollView
            headerTitle={title}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">
                    <ExpoIcon name={iconName} size={30} color="black" />
                    &nbsp;&nbsp;{ title }
                </ThemedText>
            </ThemedView>
            <ThemedView>
                <SuccessMessageScreen />
                <SuccessNewFormScreen title={title} iconName={iconName} navigation={navigation}/>
            </ThemedView>
            <ThemedView>
                <Button mode='outlined' onPress={() => navigation.navigate('WelcomeScreen')} style={{ width: '40%' }}>
                    To front page
                </Button>
            </ThemedView>
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
    }
});