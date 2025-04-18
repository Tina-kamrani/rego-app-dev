import { StyleSheet, View, Text } from "react-native";
import { theme } from "../core/theme";

const ContentHeader = ({ title, id, date }) => {
    let littleText = "";
    if (date instanceof Date && !isNaN(date)) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        littleText = `${day}.${month}.${year}  ${hours}:${minutes}`;
    } else {
        littleText = date;
    }

    return (
        <View style={ styles.container }>
            <View style={ styles.titleContainer }>
                <Text style={ styles.title }>{ title }</Text>
            </View>
            <View style={ styles.rightContainer }>
                {/* <Text style={ styles.text }>#{id}</Text> */}
                <Text style={ styles.text }>{ littleText }</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',

    },
    titleContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.text,
    }
});

export default ContentHeader;