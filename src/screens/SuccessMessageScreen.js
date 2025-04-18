import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View  } from "react-native";
import { Card, Button  } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import * as FileSystem from 'expo-file-system';
import i18n from '../core/i18n';
import ExpoIcon from "../components/ExpoIcon";
import { theme } from "../core/theme";

export default function SuccessMessageScreen({route, navigation}) {
    let pdfUri = 'https://tuumaapi.qreform.com/api/010101.pdf';

    const downloadPDF = async () => {
        if (!pdfUri) {
            alert("No PDF", "Please generate the PDF first.");
            return;
        }

        const filename = `${FileSystem.documentDirectory}success_message.pdf`;

        try {
            await FileSystem.copyAsync({
                from: pdfUri,
                to: filename,
            });

            await shareAsync(filename);
        } catch (error) {
            alert("Download Failed., Failed to download the PDF: " + error.message);
        }
    };

    const gotoDashboard = () => {
        navigation.navigate('ReportScreen', {
            params: {}
        });
    };

    return (
        <Card style={ styles.container }>
            <Card.Title 
                title={i18n.t('thanksMessage')}
                titleStyle={ styles.title }
            />
            <Card.Content>
                {/* <ThemedView>
                    <Text style={ styles.text }>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                    </Text>
                </ThemedView> */}
                <ThemedView>
                {/* <Text style={ styles.text }>{i18n.t('storeMessage')}</Text> */}
                </ThemedView>
                {/* <ThemedView>
                    <Button title="Download PDF" onPress={downloadPDF} />
                </ThemedView> */}
                <ThemedView>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={gotoDashboard}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>
                                {i18n.t('continue')}
                            </Text>
                            <ExpoIcon name="arrow-right" iconSet="Feather" size={20} color={theme.colors.text} />
                        </View>
                    </TouchableOpacity>
                </ThemedView>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.default
    },
    title: {
        fontSize: 20, 
        fontWeight: 'bold'
    },
    text: {
        marginBottom: 30
    },
    button: {
        backgroundColor: theme.colors.lightPrimary,
        borderColor: theme.colors.lightPrimary,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '500',
        marginRight: 8,
    },
});