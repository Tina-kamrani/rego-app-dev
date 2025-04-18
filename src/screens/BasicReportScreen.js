import React, { Children, useState } from "react";
import { StyleSheet, Text, View, Modal, Button, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import TextInput from '../components/TextInput';
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';
import TreeSelect from 'react-native-tree-select';
import event_data from '@/src/data/event';

export default function BasicReportScreen({ onUpdate }) {
    const [name, setName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [unit, setUnit] = useState({ value: '', error: '' });
    const [unitArr, setUnitArr] = useState({ value: '', error: '' });
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState({ hour: new Date().getHours(), minute: new Date().getMinutes() });
    const [modalVisible, setModalVisible] = useState(false);

    const handleUpdate = () => {
        onUpdate({
            name: name.value,
            email: email.value,
            unit: unit.value,
            unitArr: unitArr.value,
            date,
            time
        });
    };

    const handleSelectUnit = (selectedLabel) => {
        let unit_name = selectedLabel.routes.map(element => element.name).join(' > ');
        let unit_arr = selectedLabel.routes.map(element => element.id);

        setUnit({ value: unit_name, error: '' });
        setUnitArr({ value: unit_arr, error: '' });
        handleUpdate();
    };

    const handleTimeChange = (hours, minutes) => {
        setTime({ hour: hours, minute: minutes });
        handleUpdate();
    };

    const validateName = () => {
        if (!name.value) {
            setName({ ...name, error: "Name is required..." });
            return false;
        }
        setName({ ...name, error: '' });
        return true;
    };

    const validateEmail = () => {
        const re = /\S+@\S+\.\S+/;
        if (!email.value) {
            setEmail({ ...email, error: "Email is required..." });
            return false;
        }
        if (!re.test(email.value)) {
            setEmail({ ...email, error: "Ooops! Please input a valid email address." });
            return false;
        }
        setEmail({ ...email, error: '' });
        return true;
    };

    return (
        <Card style={styles.container}>
            <Card.Title
                title="Basic Information"
                titleStyle={styles.title}
            />
            <Card.Content>
                <ThemedView>
                    <TextInput
                        label="Name(Mandatory)"
                        returnKeyType="next"
                        value={name.value}
                        onChangeText={(text) => { setName({ value: text, error: '' }); handleUpdate(); }}
                        error={!!name.error}
                        errorText={name.error}
                        onBlur={validateName}
                    />
                    <TextInput
                        label="Email(Mandatory)"
                        returnKeyType="next"
                        value={email.value}
                        onChangeText={(text) => { setEmail({ value: text, error: '' }); handleUpdate(); }}
                        error={!!email.error}
                        errorText={email.error}
                        keyboardType="email-address"
                        onBlur={validateEmail}
                    />
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <TextInput
                            label="Unit where the event occurred(Mandatory)"
                            returnKeyType="next"
                            value={unit.value}
                            editable={false}
                            onChangeText={() => { }}
                            error={!!unit.error}
                            errorText={unit.error}
                        />
                    </TouchableOpacity>
                    <DatePicker date={date} onDateChange={setDate} />
                    <TimePicker label="Event time(Mandatory)" onTimeChange={handleTimeChange} />
                </ThemedView>

                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <ThemedView>
                            <Text style={styles.title}>Select Unit</Text>
                        </ThemedView>
                        <TreeSelect
                            data={event_data}
                            onClick={(parentNode) => handleSelectUnit(parentNode)}
                            isOpen
                            selectType="single"
                            itemStyle={{
                                fontSize: 12,
                            }}
                            selectedItemStyle={{
                                backgroudColor: '#9933ff',
                                fontSize: 16,
                                color: '#171e99'
                            }}
                            isShowTreeId={false}
                        />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    }
});