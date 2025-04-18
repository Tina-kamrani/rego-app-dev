import React from "react";
import { StyleSheet, Text } from "react-native";
import { Card, Button  } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';

export default function SuccessNewFormScreen({iconName, title, navigation}) {
    return (
        <Card style={ styles.container }>
            <Card.Title 
                title= { "New " + title }
                titleStyle={ styles.title }
            />
            <Card.Content>
                <ThemedView>
                    <Text style={ styles.text }>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                    </Text>
                </ThemedView>
                <ThemedView>
                    <Button mode="outlined" onPress={() => navigation.navigate('ReportDetailScreen', {iconName: iconName, title: title})}>
                        Create a new form
                    </Button>
                </ThemedView>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    title: {
        fontSize: 20, 
        fontWeight: 'bold'
    },
    text: {
        marginBottom: 30
    }
});