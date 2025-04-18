import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { StyleSheet, Text, Button as Btn, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Card, RadioButton, Checkbox, Modal, Portal } from "react-native-paper";
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
import consequence_data from '../data/consequence';
import { AuthContext } from "@/app/authContext";
import { theme, progressStepsStyle } from "../core/theme";
import { checkServerConnectivity, sendDataToServer, sendFilesToServer } from "../core/server";
import ExpoIcon from "../components/ExpoIcon";
import Button from '../components/Button';
import Toast from "react-native-toast-message";
import { addReport } from '@/database/ReportData';
import TimePicker from '../components/TimePicker';
import { ReportContext } from '@/app/reportContext';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import DatePickers from "../components/DatePicker";
import { PrevButton, ContinueButton, SubmitButton } from "../components/NavigationButton";

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

export default function ReportDangerScreen({ route, navigation }) {
    const path = 3;
    const headerTitle = i18n.t('reportDanger');
    const { userdata } = useContext(AuthContext);
    const { reportDangerData, updateReportDangerData, cleanReportDangerData, addFile, removeFile } = useContext(ReportContext);
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dateHappened, setDateHappened] = useState(null);
    const [dateHappenedError, setDateHappenedError] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [hourHappened, setHourHappened] = useState('');
    const [minHappened, setMinHappened] = useState('');

    
    useEffect(() => {
        const unsubscribe = navigation.addListener("state", () => {
            const routes = navigation.getState().routes;
            const currentRoute = routes[routes.length - 1];
    
            if (currentRoute.name === "ReportScreen") {
                cleanReportDangerData();
            }
        });
    
        return unsubscribe;
    }, [navigation]);
    
    const handlePrevious = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    }

    const handleNext = () => {
        let validFlag = true;
        if (reportDangerData.eventType.value === 'Tapaturma') {    
            if(!reportDangerData.isSameAsDeclarer.value || reportDangerData.personType.value !== 'vr') {

                if (!reportDangerData.InjuredPersonName.value) {
                    validFlag = false;
                    updateReportDangerData('InjuredPersonName', {
                        ...reportDangerData.InjuredPersonName,
                        error: 'Pakollinen tieto puuttuu...',
                    })
                }

                if (reportDangerData.personType.value !== 'vr' && !reportDangerData.InjuredPersonCompany.value) {
                    validFlag = false;
                    updateReportDangerData('InjuredPersonCompany', {
                        ...reportDangerData.InjuredPersonCompany,
                        error: 'Pakollinen tieto puuttuu...',
                    })
                }
            }
        }

        if (!validFlag) {
            return;
        }

        if (activeStep < 1 && validateStep1()) {
            setActiveStep(activeStep + 1);
        }
    }

    
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

                addFile(newFile, 3); // Add file to context
                setActiveStep(1);
            } catch (error) {
                console.error('Error processing new file:', error);
                showToast("Error", "Kuvan tallennus epäonnistui", "error");
            }
        }
        else {
            setActiveStep(0);
        }
    }, [route.params?.uri]);

    const validateStep1 = () => {
        let valid = true;
        if (!reportDangerData.DateHappened.value) {
            updateReportDangerData('DateHappened', { 
                ...reportDangerData.DateHappened, 
                error: "Pakollinen tieto puuttuu..." 
            });
            valid = false;
        }
        if (!reportDangerData.TimeHappened.value) {
            updateReportDangerData('TimeHappened', { 
                ...reportDangerData.TimeHappened, 
                error: "Pakollinen tieto puuttuu..." 
            });
            valid = false;
        }
        if (!reportDangerData.PlaceHappened.value) {
            updateReportDangerData('PlaceHappened', { 
                ...reportDangerData.PlaceHappened, 
                error: "Pakollinen tieto puuttuu..." 
            });

            valid = false;
        }
        return valid;
    };

    const validateStep2 = () => {
        return true;
    };

    const handleSend = async () => {
        let validFlag = true;

        if (!reportDangerData.Description.value) {
            updateReportDangerData('Description', { 
                ...reportDangerData.Description, 
                error: "Pakollinen tieto" 
            });
            validFlag = false;
        }
        if (!reportDangerData.DateHappened.value) {
            updateReportDangerData('DateHappened', {
                ...reportDangerData.DateHappened,
                error: "Pakollinen tieto puuttuu..."
            })
            validFlag = false;
        }
        if (!reportDangerData.TimeHappened.value) {
            updateReportDangerData('TimeHappened', {
                ...reportDangerData.TimeHappened,
                error: "Pakollinen tieto puuttuu..."
            })
            validFlag = false;
        }
        if (!validFlag) {
            return;
        }

        setLoading(true);

        const preIsoDate = new Date(reportDangerData.DateHappened.value);
        preIsoDate.setDate(preIsoDate.getDate() + 1);
        const isoDate = preIsoDate.toISOString().split('T')[0];
        
        const now = new Date(`${isoDate}T${reportDangerData.TimeHappened.value}`);
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
        // const isoDate = `${year}-${month}-${day}`;
        const isoTime = `${hour.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
        const isoDateTime = `${isoDate}T${isoTime}`;

        updateReportDangerData('date', { value: isoDate });
        updateReportDangerData('time', { value: isoDateTime });

        const isPersonVR = reportDangerData.personType.value === 'vr';

        const data = {
            Name: userdata.username,
            Email: userdata.email,
            UserUnitCode: userdata.unitcode,
            ClientId: userdata.clientId,
            Files: reportDangerData.files,
            EntityType: path,
            PersonType: reportDangerData.personType.value,
            IsPlace: reportDangerData.isPlace.value,
            Title: '',
            ReportTitle: 'Työtapaturma tai läheltä-piti',
            Description: reportDangerData.Description.value,
            Reason: reportDangerData.Reasons.value,
            Proposal: reportDangerData.PreventiveMeasures.value,
            IsAdditional: true,
            SelectedUnit: userdata.unitcode,
            SelectedTargets: ["21"],
            SelectedTargetCollection: [
                {
                    Id: 21,
                    IsNearMiss: reportDangerData.eventType.value === 'Läheltä piti',
                    Opt2Selected: false,
                    Opt3Selected: reportDangerData.eventType.value === 'Tapaturma',
                    Opt4Selected: false,
                    Opt5Selected: false,
                    Opt6Selected: false,
                    Target: 21,
                    custom112: isPersonVR ? userdata.userId : '',
                    custom110: isPersonVR ? userdata.userName : reportDangerData.InjuredPersonName.value,
                    custom111: isPersonVR ? '' : reportDangerData.InjuredPersonCompany.value,
                    custom4: reportDangerData.ViolenceInvolved.value ? "Kyllä" : "Ei",
                    customField9: reportDangerData.MedicalCareRequired.value ? "Kyllä" : "Ei",
                    custom7: reportDangerData.PlaceHappened.value,
                }
            ],
            DateHappened: isoDate,
            TimeHappened: isoDateTime,
            Place: {
                IsAdditional: true
            },
            Layout: "report.Layout",
        };

        try {
            const token = userdata.token_type + ' ' + userdata.access_token;

            const serverConnected = await checkServerConnectivity();

            if (!serverConnected) {
                throw new Error('No server connectivity');
            }

            console.log('Sending data to server:', data);

            const response = await sendDataToServer(data, token);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Server response:', responseData);
            if (reportDangerData.files.length > 0) {
                console.log('Sending files...');
                console.log('data: ', data);
                const fileUploadStatus = await sendFilesToServer({
                    ...data,
                    Id: responseData.Id,
                    Files: reportDangerData.files
                }, token);

                if (!fileUploadStatus) {
                    throw new Error('Failed to upload files');
                }
            }

            setLoading(false);

            
            showToast("", "Ilmoituksen lähetys onnistui");
            cleanReportDangerData();
            navigation.navigate('ReportScreen');
        } catch (error) {
            try {
                await addReport(data, 'pending');
                showToast("Info", "lmoitus tallennettu ja se lähetetään kun verkkoyhteys on hyvä", "info");
                cleanReportDangerData();
            } catch (saveError) {
                console.error('Error saving locally:', saveError);
                showToast("Error", "Paikallinen tallennus epäonnistui", "error");
            }
            
            navigation.navigate('ReportScreen');
            setLoading(false);
        }
    };

    const takePhoto = async () => {
        navigation.navigate('CameraPreview', {
            path: path
        });
    };

    const handlePlaceCheckbox = useCallback(() => {
        updateReportDangerData('isPlace', { value: !reportDangerData.isPlace.value, error: '' });
        if (!reportDangerData.isPlace.value) {
            updateReportDangerData('PlaceHappened', { value: '', error: '' });
        }
    }, [updateReportDangerData]);

    const setEventType = (value) => {
        updateReportDangerData('eventType', { value: value, error: '' });
    };

    const setPersonType = (value) => {
        updateReportDangerData('personType', { value: value, error: '' });
    };

    return (
        <ParallaxScrollView>
            <ContentHeader title={headerTitle} id="12345789" date={new Date()} />
            <Card style={styles.container}>
                <Card.Content>
                    <ProgressSteps activeStep={activeStep} {...progressStepsStyle}>
                        <ProgressStep
                            label={i18n.t('IncidentDetails')}
                            onNext={() => validateStep1()}
                            // errors={!validateStep1()}
                            removeBtnRow={true}
                        >
                            <ThemedView>
                                <RadioButton.Group onValueChange={setEventType} value={reportDangerData.eventType.value}>
                                    <RadioButton.Item label={i18n.t('NearMiss')} value="Läheltä piti" />
                                    <RadioButton.Item label={i18n.t('Accident')} value="Tapaturma" />
                                </RadioButton.Group>
                                <DatePickers
                                    label={'Tapahtumapäivä*'}
                                    date={reportDangerData.DateHappened.value}
                                    onDateChange={(date) => { 
                                        updateReportDangerData('DateHappened', {
                                            value: date,
                                            error: '',
                                        })
                                    }}
                                    hasError={!!reportDangerData.DateHappened.error}
                                />
                                <TimePicker
                                    label={'Tapahtuma-aika'}
                                    onTimeChange={(timestr) => {
                                        updateReportDangerData('TimeHappened', {
                                            value: timestr,
                                            error: '',
                                        })
                                    }}
                                    date={reportDangerData.DateHappened.value}
                                    time={reportDangerData.TimeHappened.value}
                                    hasError={!!reportDangerData.TimeHappened.error}
                                />
                                
                                {!reportDangerData.isPlace.value && (
                                    <TextInput
                                        label={`${i18n.t('Location')}*`}
                                        value={reportDangerData.PlaceHappened.value}
                                        onChangeText={(text) => {
                                            updateReportDangerData('PlaceHappened', { value: text, error: '' });
                                        }}
                                        style={{ marginVertical: 2 }}
                                        error={!!reportDangerData.PlaceHappened.error}
                                        errorText={reportDangerData.PlaceHappened.error}
                                    />
                                )}

                                {reportDangerData.eventType.value === 'Tapaturma' && (
                                    <>
                                        <Checkbox.Item
                                            label={i18n.t('NeedDoctor')}
                                            status={reportDangerData.MedicalCareRequired.value ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                updateReportDangerData('MedicalCareRequired', { value: !reportDangerData.MedicalCareRequired.value, error: '' });
                                            }}
                                        />
                                        <View style={styles.radioGroupContainer}>
                                            <ThemedText style={styles.radioGroupLabel}> {i18n.t('InjuredPerson')}:</ThemedText>
                                            <RadioButton.Group onValueChange={setPersonType} value={reportDangerData.personType.value}>
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label={i18n.t('VRPersonnel')} value="vr" />
                                                    <RadioButton.Item label={i18n.t('TemporaryEmployee')} value="temporary" />
                                                    <RadioButton.Item label={i18n.t('Subcontractor')} value="subcontractor" />
                                                    <RadioButton.Item label={i18n.t('ThirdParty')} value="other" />
                                                </View>
                                            </RadioButton.Group>
                                        </View>

                                        {reportDangerData.personType.value === 'vr' && (
                                            <Checkbox.Item
                                                label={i18n.t('IsInjuredDeclarant')}
                                                status={reportDangerData.isSameAsDeclarer.value ? 'checked' : 'unchecked'}
                                                onPress={() => updateReportDangerData('isSameAsDeclarer', { value: !reportDangerData.isSameAsDeclarer.value, error: '' })}
                                            />
                                        )}

                                        {(!reportDangerData.isSameAsDeclarer.value || reportDangerData.personType.value !== 'vr') && (
                                            <>
                                                <TextInput
                                                    label={i18n.t('PersonName').concat("*")}
                                                    value={reportDangerData.InjuredPersonName.value}
                                                    onChangeText={(text) => updateReportDangerData('InjuredPersonName', { value: text, error: '' })}
                                                    errorText={reportDangerData.InjuredPersonName.error}
                                                    error={!!reportDangerData.InjuredPersonName.error}
                                                />
                                                {reportDangerData.personType.value !== 'vr' && (
                                                    <TextInput
                                                        label={i18n.t('Company').concat("*")}
                                                        value={reportDangerData.InjuredPersonCompany.value}
                                                        onChangeText={(text) => updateReportDangerData('InjuredPersonCompany', { value: text, error: '' })}
                                                        errorText={reportDangerData.InjuredPersonCompany.error}
                                                        error={!!reportDangerData.InjuredPersonCompany.error}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </>
                                )}

                                <View style={styles.buttonContainer}>
                                    <PrevButton onPress={handlePrevious} disabled={activeStep < 1} />
                                    <ContinueButton onPress={handleNext} disabled={activeStep > 0} />
                                </View>
                            </ThemedView>
                        </ProgressStep>

                        <ProgressStep
                            label={i18n.t('AdditionalInformation')}
                            errors={!validateStep2()}
                            removeBtnRow={true}
                        >
                            <ThemedView>
                                <Checkbox.Item
                                    label={i18n.t('IsViolence')}
                                    status={reportDangerData.ViolenceInvolved.value ? 'checked' : 'unchecked'}
                                    onPress={() => updateReportDangerData('ViolenceInvolved', { value: !reportDangerData.ViolenceInvolved.value, error: '' })}
                                />
                                <TextInput
                                    label={`${i18n.t('description')}*`}
                                    value={reportDangerData.Description.value}
                                    onChangeText={(text) => {
                                        updateReportDangerData('Description', { value: text, error: '' });
                                    }}
                                    error={!!reportDangerData.Description.error}
                                    errorText={reportDangerData.Description.error}
                                    multiline={true}
                                />
                                <TextInput
                                    label={i18n.t('reasons')}
                                    value={reportDangerData.Reasons.value}
                                    onChangeText={(text) => {
                                        updateReportDangerData('Reasons', { value: text, error: '' });
                                    }}
                                />
                                <TextInput
                                    label={i18n.t('measures')}
                                    value={reportDangerData.PreventiveMeasures.value}
                                    onChangeText={(text) => {
                                        updateReportDangerData('PreventiveMeasures', { value: text, error: '' });
                                    }}
                                />
                                <Button style={styles.button} onPress={takePhoto}>
                                    <ExpoIcon name="camera" iconSet="Feather" size={24} color={theme.colors.primary} />
                                    <Text style={styles.buttonText}> {i18n.t('camera')}</Text>
                                </Button>
                                {reportDangerData.files.map((file, index) => (
                                    <SelectedFile
                                        key={index}
                                        filename={file.name}
                                        onDelete={() => removeFile(file.uri, path)}
                                    />
                                ))}

                                
                                <View style={styles.buttonContainer}>
                                    <PrevButton onPress={handlePrevious} disabled={activeStep < 1} />   
                                    <SubmitButton onPress={handleSend}/>
                                </View>
                            </ThemedView>
                        </ProgressStep>
                    </ProgressSteps>
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
        marginBottom: 4,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 10
    },
    stepLabel: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        color: theme.colors.primary,
    },
    activeStepLabel: {
        color: theme.colors.secondary,
    },
    stepIndicator: {
        backgroundColor: theme.colors.primary,
    },
    activeStepIndicator: {
        backgroundColor: theme.colors.secondary,
    },
    radioGroupContainer: {
        marginVertical: 5,
        borderWidth: 1,
        borderColor: theme.colors.lightPrimary,
        borderRadius: 8,
        padding: 5,
    },
    radioGroupLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    radioButtonsContainer: {
        backgroundColor: theme.colors.lightPrimary,
        borderRadius: 4,
    },
    checkboxItem: {
        marginVertical: 0,
    },
    radioButtonItem: {
        marginVertical: 2,
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