import React from 'react';
import { StyleSheet, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import BackButton from '../components/BackButton';
import IconLongButton from '../components/IconLongButton';
import report_data from '@/src/data/report';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default function ReportScreen1({ route, navigation }) {
    const { iconName, title } = route.params;

    let reports = report_data.map((element, index) => {
        return (
            // <IconLongButton 
            //     key={index}
            //     iconName={element.icon}
            //     label={element.title}
            //     onPress={() => navigation.navigate('ReportDetailScreen', {iconName: element.icon, title: element.title})}
            // />
            <ThemedText>AAA</ThemedText>
        );
    });

    return (
        <ParallaxScrollView
            headerTitle={title}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">
                    <Icon name={iconName} size={30} color="#000" />
                    &nbsp;&nbsp;{ title }
                </ThemedText>
            </ThemedView>
            <ThemedView>
                {reports}
            </ThemedView>
            <ThemedView>
                <Button title='Back' 
                        onPress={() => navigation.goBack()}
                />
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
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    }
});