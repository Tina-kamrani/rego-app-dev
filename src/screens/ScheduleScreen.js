import React, { useState } from "react";
import { StyleSheet, Text, Button } from "react-native";
import { Card  } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import * as FileSystem from 'expo-file-system';
import i18n from "../core/i18n";

export default function ScheduleScreen() {
    return (
        <Card style={ styles.container }>
            <Card.Title 
                title={i18n.t('schedule')}
                titleStyle={ styles.title }
            />
            <Card.Content>
                <ThemedView>
                    <Text style={ styles.text }>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                    </Text>
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