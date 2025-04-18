import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Button, Text, View, ActivityIndicator, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import IconLongButton from '../components/IconLongButton';
import ReportWaitListScreen from '@/src/screens/ReportWaitListScreen';
import ContentHeader from '../components/ContentHeader';
import Toast from 'react-native-toast-message';
import i18n from '../core/i18n';
import { theme } from "../core/theme";
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "@/app/authContext";
import Logo from '../components/Logo';

const showToast = (state, message, type) => {
    Toast.show({
      type,
      position: 'top',
      text1: state,
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
};

export default function ReportScreen({ route , navigation }) {
    const { state = "", message = "", type = "success" } = route.params ? route.params.params : {};
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const { userdata } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            setRefresh(!refresh); // Toggle state to trigger rerender
        }, [])
    );

    useEffect(() => {
        if (message) {
            showToast(state, message, type);
        }

        const unsubscribe = navigation.addListener('focus', () => {
            setRefresh(prev => !prev);
        });
        return unsubscribe;

    }, [message, navigation]);

    let report_data = [
        { icon: 'shield-check-outline', iconSet: 'MaterialCommunityIcons', title: i18n.t('safetyFinding'), path: 2 },
        { icon: 'alert-triangle', iconSet: 'Feather', title: i18n.t('workAccident'), path: 3 },
    ];

    if (userdata.alternativeUse) {
        report_data.push({ icon: 'shield-alert-outline', iconSet: 'MaterialCommunityIcons', title: "Matkustajaturvallisuus", path: 4 })
        report_data.push({ icon: 'shield-alert-outline', iconSet: 'MaterialCommunityIcons', title: "Tieliikenneturvallisuus", path: 4 })
    } else {
        report_data.push({ icon: 'shield-alert-outline', iconSet: 'MaterialCommunityIcons', title: i18n.t('securityBreach'), path: 4 })
    }

    let reports = report_data.map((element, index) => {
        return (
            <IconLongButton 
                key={index}
                iconName={element.icon}
                iconSet={element.iconSet}
                label={element.title}
                onPress={() => {
                    let screen = 'SafetyFindingScreen';
                    if (element.path === 3)
                        screen = 'ReportDangerScreen';
                    else if(element.path === 4)
                        screen = 'SecurityBreachScreen';
                    navigation.navigate('Dashboard', {
                        screen,
                        params: { 
                            path: element.path,
                            title: (element.title === "Matkustajaturvallisuus" || element.title === "Tieliikenneturvallisuus") ? "PL " + element.title : element.title,
                        }
                    })
                }}
            />
        );
    });

    return (
        <View style={ styles.container }>
            <ThemedView backgroundColor={'white'}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center',alignItems: 'center', paddingVertical: 20}}>
                    <Image source={require('@/assets/images/front.png')} style={{ width: 40, height: 40 }} />
                    <Text style={{paddingLeft: 10, fontSize: 48, fontWeight: 800}}>Tuuma</Text>
                </View>
            </ThemedView>
            <View style={{paddingLeft: 32, paddingRight: 32, flex: 1}}>
                <ContentHeader title={i18n.t('createNewReport')} id="12345789" date="v18.0.0" />
                <ThemedView>
                    {reports}
                </ThemedView>
                <ThemedView style={styles.reportlistContainer}>
                    <ReportWaitListScreen loading={loading} setLoading={(isLoading) => setLoading(isLoading)} />
                </ThemedView>
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.bottomText}>Powered by Rego HSEQ</Text>
                </View>   
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        overflow: 'hidden',
        backgroundColor: theme.colors.default,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 14,
      fontWeight: '500'
    },
    reportlistContainer: {
        flex: 1,
        paddingBottom: 60
    },
    bottomText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.primary,
    },
    bottomTextContainer: {
        position: 'absolute',
        bottom: 0, 
        left: 0,
        right: 0,
        alignItems: 'center',
        textShadowColor: theme.colors.primary,
        paddingVertical: 10,
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