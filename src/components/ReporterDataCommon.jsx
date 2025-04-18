import i18n from '../core/i18n';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import TextInput from './TextInput';
import { theme } from "../core/theme";

export default function ReporterDataCommon({
    personType,
    setPersonType,
    personName,
    setPersonName,
    companyName,
    setCompanyName
}) {
    return (
        <>
            <View style={styles.radioGroupContainer}>
                <ThemedText style={styles.radioGroupLabel}> {i18n.t('Reporter')}:</ThemedText>
                <RadioButton.Group onValueChange={setPersonType} value={personType.value}>
                    <View style={styles.radioButtonsContainer}>
                        <RadioButton.Item label={i18n.t('VRPersonnel')} value="vr" />
                        <RadioButton.Item label={i18n.t('TemporaryEmployee')} value="temporary" />
                        <RadioButton.Item label={i18n.t('Subcontractor')} value="subcontractor" />
                        <RadioButton.Item label={i18n.t('ThirdParty')} value="other" />
                    </View>
                </RadioButton.Group>
            </View>
            
            { personType.value !== 'vr' && (
                <>
                    <TextInput
                        label={`${i18n.t('PersonName')}*`}
                        value={personName.value}
                        onChangeText={setPersonName}
                        errorText={personName.error}
                        error={!!personName.error}
                    />
                    <TextInput
                        label={`${i18n.t('Company')}*`}
                        value={companyName.value}
                        onChangeText={setCompanyName}
                        errorText={personName.error}
                        error={!!companyName.error}
                    />
                </>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1D1E20',
        marginBottom: 4,
    },
    button: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 1,
        backgroundColor: theme.colors.default,
        marginVertical: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600'
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
        color: theme.colors.default,
    },
    activeStepLabel: {
        color: theme.colors.text,
    },
    stepIndicator: {
        backgroundColor: theme.colors.default,
    },
    activeStepIndicator: {
        backgroundColor: theme.colors.text,
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