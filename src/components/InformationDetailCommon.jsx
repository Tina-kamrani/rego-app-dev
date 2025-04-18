import i18n from '../core/i18n';
import SelectedFile from "./SelectedFile";
import TextInput from './TextInput';
import Button from './Button';
import { theme } from "../core/theme";
import { StyleSheet, Text } from 'react-native';
import ExpoIcon from "./ExpoIcon";
import DatePickers from './DatePicker';
import TimePicker from './TimePicker';
import { useEffect } from 'react';

export default function InformationDetailCommon({
    description,
    setDescription,
    descriptionError,
    reasons,
    setReasons,
    measures,
    setMeasures,
    camFiles,
    onDeleteFile,
    takePhoto,
    path,
    setDateHappened,
    dateHappened,
    setTimeHappened,
    timeHappened,
}) {
   return (
        <>
            <TextInput
                label={`${i18n.t('description')}*`}
                value={description}
                onChangeText={(text) => {
                    setDescription(text);
                }}
                errorText={descriptionError}
                error={!!descriptionError}
                multiline={true}
            />
            <TextInput
                label={i18n.t('reasons')}
                value={reasons}
                onChangeText={(text) => {
                    setReasons(text);
                }}
            />
            <TextInput
                label={i18n.t('measures')}
                value={measures}
                onChangeText={(text) => {
                    setMeasures(text);
                }}
            />
            <DatePickers
                label={'Tapahtumapäivä*'}
                date={dateHappened.value}
                onDateChange={(date) => setDateHappened(date)}
                hasError={!!dateHappened.error}
            />
            <TimePicker
                label={'Tapahtuma-aika'}
                time={timeHappened.value}
                onTimeChange={(time) => {
                    setTimeHappened(time);
                }}
                date={dateHappened.value}
                hasError={!!timeHappened.error}
            />
            <Button style={styles.button} onPress={takePhoto}>
                <ExpoIcon name="camera" iconSet="Feather" size={24} color={theme.colors.primary} />
                <Text style={styles.buttonText}> {i18n.t('camera')}</Text>
            </Button>
            {camFiles.map((file, index) => (
                <SelectedFile 
                    key={index} 
                    filename={file.name} 
                    onDelete={() => onDeleteFile(file.uri, path)}
                />
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.default,
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