import { View, Text, TextInput, StyleSheet } from "react-native";

const InputField = ({label, placeholder}) => {
    return (
        <View>
            <View style={styles.labelContainer}>
                <Text>{ label }</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder={ placeholder } />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    labelContainer: {
        backgroundColor: "white",
        alignSelf: "flex-start",
        paddingHorizontal: 3,
        marginStart: 10,
        zIndex: 1,
        elevation: 1,
        shadowColor: "white",
        position: "absolute",
        top: -10,
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: 3,
        padding: 8,
        zIndex: 0,
    },
});

export default InputField;