import React, { useContext, useState } from "react";
import { StyleSheet, Text, Button, Alert } from "react-native";
import { Card } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '@/app/authContext'; // Import your AuthContext
import i18n from "../core/i18n";
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { deleteAllReports } from "@/database/ReportData";
import { theme } from "../core/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReportContext } from '@/app/reportContext';

export default function LogoutScreen() {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const { setUserdata } = useContext(AuthContext); // Access AuthContext to clear user data
    const {
        clearReportData,
        cleanReportDangerData,
        cleanBreachData,
    } = useContext(ReportContext);

    const onLogoutPressed = async () => {
        setLoading(true);
        try {
            // Clear user data from context
            setUserdata({});
            
            // Clear the user cache data from the AsyncStorage
            await AsyncStorage.removeItem('userData');

            cleanBreachData();
            clearReportData();
            cleanReportDangerData();

            // Navigate back to the login screen and reset the navigation stack
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }], // Replace 'LoginScreen' with your actual login screen name
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={styles.container}>
            <Card.Title 
                title={t('logout')}
                titleStyle={styles.title}
            />
            <Card.Content>
                <Text style={styles.text}>
                    {t('logout_message')}
                </Text>
                <ThemedView>
                    <Button
                        onPress={onLogoutPressed}
                        title={t('logout')}
                        color={theme.colors.primary}
                        disabled={loading}
                    />
                </ThemedView>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.lightPrimary,
        margin: 10,
        padding: 10,
    },
    title: {
        fontSize: 20, 
        fontWeight: 'bold',
    },
    text: {
        marginBottom: 30,
        fontSize: 20,
        color: theme.colors.text
    },
});
