import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

export default function CheckboxGrid({ label, status, color, onToggle }) {
    return (
        <TouchableOpacity onPress={onToggle} style={styles.container}>
            <Checkbox
                status={status ? 'checked' : 'unchecked'}
                onPress={onToggle}
                color={color ? color : 'black'}
            />
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginLeft: 8,
    },
});