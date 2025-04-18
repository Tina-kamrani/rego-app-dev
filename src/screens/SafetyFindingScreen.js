import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, Modal, Button as Btn, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Card, Checkbox } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from "@/components/ThemedText";
import TextInput from '../components/TextInput';
import i18n from "../core/i18n";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ContentHeader from "../components/ContentHeader";
import CheckboxGrid from "../components/CheckBoxGrid";
import SelectedFile from "../components/SelectedFile";
import { addRiskType, fetchRiskTypes } from '@/database/RiskType';
import risk_data from '../data/risk';
import { AuthContext } from "@/app/authContext";
import { theme } from "../core/theme";
import { checkServerConnectivity, sendDataToServer, sendFilesToServer } from "../core/server";
import ExpoIcon from "../components/ExpoIcon";
import Button from '../components/Button';
import Toast from "react-native-toast-message";
import { addReport } from '@/database/ReportData';
import { ReportContext } from '@/app/reportContext';

import { useNavigationState } from '@react-navigation/native';

const showToast = (state, message, type = 'success') => {
    Toast.show({
      type,
      position: 'top',
      text1: state,
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
};

export default function SafetyFindingScreen({ route, navigation }) {
    const { userdata } = useContext(AuthContext);
    const { 
        reportData, 
        updateReportData, 
        addFile, 
        removeFile, 
        clearReportData 
    } = useContext(ReportContext);

    const path = 2;
    const headerTitle = i18n.t('safetyFinding');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener("state", () => {
            const routes = navigation.getState().routes;
            const currentRoute = routes[routes.length - 1];
    
            if (currentRoute.name === "ReportScreen") {
                clearReportData();
            }
        });
    
        return unsubscribe;
    }, [navigation]);
    
    // Handle new photo from camera
    useEffect(() => {
        if (route.params?.uri) {
            try {
                const newFile = {
                    uri: route.params.uri,
                    name: route.params.filename || route.params.uri.split('/').pop(),
                    file: route.params.file,
                    type: route.params.mimeType || 'image/jpeg',
                    size: route.params.fileSize,
                    timestamp: route.params.timestamp
                };
    
                addFile(newFile); // Add file to context
            } catch (error) {
                console.error('Error processing new file:', error);
                showToast("Error", "Kuvan tallennus epäonnistui", "error");
            }
        }
    }, [route.params?.uri]);
    
    const takePhoto = async () => {
        navigation.navigate('CameraPreview', {
            path: path
        });
    };

    const handleSend = async () => {
        setLoading(true);
        if (!reportData.hazard.value || !reportData.place.value) {
            if (!reportData.place.value)
                updateReportData('place', { 
                    ...reportData.place, 
                    error: "Pakollinen tieto puuttuu..." 
                });
            
            if (!reportData.hazard.value)
                updateReportData('hazard', { 
                    ...reportData.hazard, 
                    error: "Pakollinen tieto puuttuu..." 
                });
            setLoading(false);
            return;
        }
            // Prepare files data
        const fileData = reportData.files.map((file) => ({
            FileName: file.name,
            ContentType: file.type || "image/jpeg",
            ContentLength: file.size || 0
        }));

        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Etc/GMT-2', // UTC+2
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // Ensure 12-hour format with AM/PM
        });
        const parts = formatter.formatToParts(now);

        // Extract parts
        const year = parts.find(p => p.type === 'year').value;
        const month = parts.find(p => p.type === 'month').value;
        const day = parts.find(p => p.type === 'day').value;
        let hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
        const minute = parts.find(p => p.type === 'minute').value;
        const second = parts.find(p => p.type === 'second').value;
        const ampm = parts.find(p => p.type === 'dayPeriod').value;

        // Convert hour to 24-hour format
        if (ampm === 'PM' && hour !== 12) {
            hour += 12;
        } else if (ampm === 'AM' && hour === 12) {
            hour = 0;
        }

        // Build ISO strings
        const isoDate = `${year}-${month}-${day}`;
        const isoTime = `${hour.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
        const isoDateTime = `${isoDate}T${isoTime}`;
        // Prepare request data

        const data = {
            Name: userdata.username,
            Email: userdata.email,
            UserUnitCode: userdata.unitcode,
            ClientId: userdata.clientId,
            SelectedUnit: userdata.unitcode,
            DateHappened: isoDate,
            TimeHappened: isoDateTime,
            SelectedTargets: [20],
            EntityType: path,
            Location: reportData.place.value,
            IsPositive: reportData.positive,
            Title: "",
            ReportTitle: 'Turvallisuushavainto',
            Description: reportData.hazard.value,
            Reason: reportData.factor.value,
            Proposal: reportData.measure.value,
            CorrectiveMeasuresCompleted: reportData.correctiveActionsCompleted.value,
            IsRelatedToEnvironment: reportData.environmentRelated.value,
            IsAdditional: true,
            Place: {
                IsAdditional: false,
            },
            Layout: "",
            // Filedata: reportData.files.map(f => f.file), // Send base64 data
            Files: reportData.files,
            FileNames: fileData
        };

        try {
            const token = userdata.token_type + ' ' + userdata.access_token;
           
            const serverConnected = await checkServerConnectivity();

            if (!serverConnected) {
                throw new Error('No server connectivity');
            }
            const response = await sendDataToServer(data, token);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const responseData = await response.json();

            if (reportData.files.length > 0) {
                console.log('Sending files...');
                const fileUploadStatus = await sendFilesToServer({
                    ...data,
                    Id: responseData.Id,
                    Files: reportData.files
                }, token);

                if (!fileUploadStatus) {
                    throw new Error('Failed to upload files');
                }
            }

            showToast("", "Ilmoituksen lähetys onnistui");
            clearReportData();
            navigation.navigate('ReportScreen');
            setLoading(false);

        } catch (error) {
            
            try {
                await addReport(data, 'pending');
                showToast("", "lmoitus tallennettu ja se lähetetään kun verkkoyhteys on hyvä", "info");
                clearReportData();
                navigation.navigate('ReportScreen');
            } catch (saveError) {
                console.error('Error saving locally:', saveError);
                showToast("", "Paikallinen tallennus epäonnistui", "error");
            }
            setLoading(false);
        }
    };

    return (
        <ParallaxScrollView>
            <ContentHeader title={headerTitle} id="12345789" date={new Date()} />
            <Card style={styles.container}>
                <Card.Content>
                    <ThemedView>
                        <TextInput
                            label={`${i18n.t('place')}*`}
                            returnKeyType="next"
                            value={reportData.place.value}
                            onChangeText={(text) => {
                                updateReportData('place', { value: text, error: '' });
                            }}
                            error={!!reportData.place.error}
                            errorText={reportData.place.error}
                        />
                    </ThemedView>
                    <ThemedView>
                        <TextInput
                            label={`${i18n.t('description')}*`}
                            multiline={true}
                            value={reportData.hazard.value}
                            onChangeText={(text) => {
                                updateReportData('hazard', { value: text, error: '' });
                            }}
                            error={!!reportData.hazard.error}
                            errorText={reportData.hazard.error}
                        />
                    </ThemedView>
                    <ThemedView>
                        <TextInput
                            label={i18n.t('reasons')}
                            multiline={true}
                            value={reportData.factor.value}
                            onChangeText={(text) => {
                                updateReportData('factor', { value: text, error: '' });
                            }}
                        />
                    </ThemedView>
                    <ThemedView>
                        <TextInput
                            label={i18n.t('measures')}
                            multiline={true}
                            value={reportData.measure.value}
                            onChangeText={(text) => {
                                updateReportData('measure', { value: text, error: '' });
                            }}
                        />
                    </ThemedView>
                    <ThemedView>            
                        <Checkbox.Item
                            label={'Korjaavat toimenpiteet on jo saatu tehtyä'}
                            status={reportData.correctiveActionsCompleted.value ? 'checked' : 'unchecked'}
                            onPress={() => {
                                updateReportData('correctiveActionsCompleted', { value: !reportData.correctiveActionsCompleted.value, error: '' });
                            }}
                        />
                    </ThemedView>
                    <ThemedView>
                        <Checkbox.Item
                            label={i18n.t('positive')}
                            status={reportData.positive ? 'checked' : 'unchecked'}
                            // status={breachData.externalHelp.value.guard ? 'checked' : 'unchecked'}
                            onPress={() => updateReportData('positive', !reportData.positive)}
                        />
                    </ThemedView>
                    <ThemedView>            
                        <Checkbox.Item
                            label={'Havainto liittyy ympäristöön'}
                            status={reportData.environmentRelated.value ? 'checked' : 'unchecked'}
                            onPress={() => {
                                updateReportData('environmentRelated', { value: !reportData.environmentRelated.value, error: '' });
                            }}
                        />
                    </ThemedView>
                    <ThemedView>
                        <Button style={styles.button} onPress={takePhoto}>
                            <ExpoIcon name="camera" iconSet="Feather" size={24} color={theme.colors.primary} />
                            <Text style={styles.buttonText}> {i18n.t('camera')}</Text>
                        </Button>
                        {reportData.files.map((file, index) => (
                            <SelectedFile 
                                key={index} 
                                filename={file.name} 
                                onDelete={() => removeFile(file.uri)}
                            />
                        ))}
                    </ThemedView>
                    <ThemedView>
                        <Button style={{ backgroundColor: theme.colors.primary, color: '#FFFFFF', borderRadius: 1 }} onPress={() => handleSend()}>
                            <Text style={{ color: '#FFFFFF' }}>{i18n.t('send')}</Text>
                        </Button>
                    </ThemedView>
                </Card.Content>
            </Card>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            )}
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.default,
        marginBottom: 20,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1D1E20',
    },
    button: {
        borderWidth: 1,
        borderColor: theme.colors.default,
        borderRadius: 1,
        backgroundColor: theme.colors.lightPrimary,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    radioLabel: {
        fontSize: 16,
        marginLeft: 5,
        color: '#1D1E20',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent background
    },
});