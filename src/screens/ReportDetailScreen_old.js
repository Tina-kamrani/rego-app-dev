import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BasicReportScreen from './BasicReportScreen';
import RiskReportScreen from './RiskReportScreen';
import AttachReportScreen from './AttachReportScreen';
import ConfirmReportScreen from './ConfirmReportScreen';

export default function ReportDetailScreen({ route, navigation }) {
    const { iconName, title } = route.params;
    const [reportData, setReportData] = useState({
        basicInfo: {},
        riskReport: {},
        attachments: []
    });

    const handleBasicInfoUpdate = (newData) => {
        setReportData((prevData) => ({ ...prevData, basicInfo: newData }));
    };

    const handleRiskReportUpdate = (newData) => {
        setReportData((prevData) => ({ ...prevData, riskReport: newData }));
    };

    const handleAttachmentsUpdate = (newAttachments) => {
        setReportData((prevData) => ({ ...prevData, attachments: newAttachments }));
    };

    return (
        <ParallaxScrollView
            headerTitle={title}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">
                    &nbsp;&nbsp;{ title }
                </ThemedText>
            </ThemedView>
            <BasicReportScreen onUpdate={handleBasicInfoUpdate} />
            <RiskReportScreen onUpdate={handleRiskReportUpdate} />
            <AttachReportScreen onUpdate={handleAttachmentsUpdate} />
            <ConfirmReportScreen iconName={iconName} title={title} navigation={navigation} reportData={reportData} />
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    }
});