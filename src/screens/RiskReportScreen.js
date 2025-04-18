import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import TextInput from '../components/TextInput';
import CheckboxGrid from "../components/CheckBoxGrid";
import { addRiskType, fetchRiskTypes } from '@/database/RiskType';
import risk_data from '../data/risk';

export default function RiskReportScreen({onUpdate}) {
    const [riskTypes, setRiskTypes] = useState([]);
    const [hazard, setHazard] = useState({ value: '', error: '' });
    const [factor, setFactor] = useState({ value: '', error: '' });
    const [event, setEvent] = useState({ value: '', error: '' });
    const [selectedRisks, setSelectedRisks] = useState({});

    const handleUpdate = () => {
        onUpdate({
            selectedRisks,
            hazard: hazard.value,
            factor: factor.value,
            event: event.value
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const existingRiskTypes = await fetchRiskTypes();
            let updatedRiskTypes = existingRiskTypes;
        
            for (let element of risk_data) {
              const exists = existingRiskTypes.some(riskType => riskType.name === element.title);
        
              if (!exists) {
                updatedRiskTypes = await addRiskType({
                  name: element.title,
                  status: element.status,
                });
              }
            }
            
            const riskData = await fetchRiskTypes();
            setRiskTypes(riskData);

            // Validate risk type selection
            const initialSelection = {};
            riskData.forEach((risk) => {
                initialSelection[risk.name] = risk.status === true;
            });

            setSelectedRisks(initialSelection);
          };
      
          fetchData();
    }, []);

    const handleCheckboxChange = (riskName) => {
        setSelectedRisks((prevSelectedRisks) => ({
            ...prevSelectedRisks,
            [riskName]: !prevSelectedRisks[riskName],
        }));
    };

    const risks = riskTypes.map((element, index) => (
        <CheckboxGrid
            key={index}
            label={element.name}
            status={selectedRisks[element.name]}
            onToggle={() => handleCheckboxChange(element.name)}
        />
    ));

    const validateHazard = () => {
        if (!hazard.value) {
            setHazard({ ...hazard, error: "Pakollinen tieto puuttuu..." });
            return false;
        }

        setHazard({ ...hazard, error: '' });
        return true;
    };

    const validateFactor = () => {
        if (!factor.value) {
            setFactor({ ...factor, error: "Pakollinen tieto puuttuu..." });
            return false;
        }

        setFactor({ ...factor, error: '' });
        return true;
    };

    const validateEvent = () => {
        if (!event.value) {
            setEvent({ ...event, error: "Pakollinen tieto puuttuu..." });
            return false;
        }

        setEvent({ ...event, error: '' });
        return true;
    };

    const validateCheckboxSelection = () => {
        const selected = Object.values(selectedRisks).some((isSelected) => isSelected);

        if (!selected) {
            Alert.alert("Validation Error", "At least one risk type must be selected.");
            return false;
        }
        return true;
    };

    return (
        <Card style={ styles.container }>
            <Card.Title 
                title="Risk details"
                titleStyle={ styles.title }
            />
            <Card.Content>
                <ThemedView>
                    <Text>Select a risk type (Mandatory)</Text>
                    { risks }
                </ThemedView>
                <ThemedView>
                    <TextInput
                        label="Describe potential risk or hazard (Mandatory)"
                        multiline={true}
                        value={hazard.value}
                        onChangeText={
                            (text) => { 
                                setHazard({value: text, error: ''}); 
                                handleUpdate(); 
                            }
                        }
                        error={!!hazard.error}
                        errorText={hazard.error}
                        onBlur={validateHazard}
                    />
                </ThemedView>
                <ThemedView>
                    <TextInput
                        label="Describe the causal factors for the risk (Mandatory)"
                        multiline={true}
                        value={factor.value}
                        onChangeText={
                            (text) => { 
                                setFactor({value: text, error: ''}); 
                                handleUpdate(); 
                            }
                        }
                        error={!!factor.error}
                        errorText={factor.error}
                        onBlur={validateFactor}
                    />
                </ThemedView>
                <ThemedView>
                    <TextInput
                        label="Suggest how the event could be prevented (Mandatory)"
                        multiline={true}
                        value={event.value}
                        onChangeText={
                            (text) => { 
                                setEvent({value: text, error: ''}); 
                                handleUpdate(); 
                            }
                        }
                        error={!!event.error}
                        errorText={event.error}
                        onBlur={validateEvent}
                    />
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
    }
});