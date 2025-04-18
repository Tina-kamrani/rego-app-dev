import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { theme } from '../core/theme';
import ExpoIcon from "./ExpoIcon";

export default function SelectedFile({ filename, onDelete }) {
    return (
        <View style={styles.badgeContainer}>
            <ExpoIcon name="paperclip" iconSet="Feather" size={15} color={theme.colors.secondary} />
            <Text style={styles.badgeText}>{ filename }</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onDelete}>
                <ExpoIcon name="times" iconSet="FontAwesome" size={15} color={theme.colors.secondary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.lightPrimary,
        paddingHorizontal: 12,
        paddingVertical: 3,
        marginBottom: 5
    },
    badgeText: {
        marginLeft: 8,
        fontSize: 12,
        color: theme.colors.text,
        fontWeight: 'bold',
        flex: 1,
    },
    closeButton: {
        marginLeft: 8,
        borderRadius: 12,
        padding: 4,
    },
});