import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { AuthContext } from "@/app/authContext";
import { theme } from "../core/theme";

export default function AvatarTitle() {
    const { userdata } = useContext(AuthContext);
    

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/avatar.png')} style={styles.image} />
            <Text style={styles.text}>{userdata.username}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '4%',
    },
    image: {
        marginRight: 8,
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.text,
    },
});