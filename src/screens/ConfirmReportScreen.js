import React, { useCallback } from "react";
import { StyleSheet, Text, Button } from "react-native";
import { Card } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import { addReport } from '@/database/ReportData';
import Toast from 'react-native-toast-message';

const checkServerConnectivity = async () => {
  try {
    const response = await fetch('https://tuumaapi.qreform.com/', {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
};

const showToast = (state, message, type = 'success') => {
  Toast.show({
    type,
    position: 'top',
    text1: state,
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
  });
};

const saveData = async (iconName, title, reportData, navigation) => {
  try {
    if(reportData.attachments && reportData.basicInfo && reportData.riskReport) {
        await addReport(reportData);
        showToast("Success!", "Report saved locally.");
    
        navigation.navigate('SuccessScreen', { iconName, title });
    } else {
        showToast("Error!", "All fields must be inputed.", "error");
    }
  } catch (error) {
    showToast("Error!", "An error occurred while saving the report.", 'error');
  }
};

export default function ConfirmReportScreen({ iconName, title, reportData, navigation }) {
  const handleSend = useCallback(async () => {
    const serverConnected = await checkServerConnectivity();

    if (serverConnected) {
      try {
        const response = await fetch('https://tuumaapi.qreform.com/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        });

        if (response.ok) {
          showToast("Success!", "Report sent successfully.");
          navigation.navigate('SuccessScreen', { iconName, title });
        } else {
          showToast("Error!", "Failed to send report. Report saved locally. If the server is alive, send report automatically.", "error");
          saveData(iconName, title, reportData, navigation);
        }
      } catch (error) {
        showToast("Error!", "An error occurred while sending the report. Report saved locally. If the server is alive, send report automatically.", "error");
        saveData(iconName, title, reportData, navigation);
      }
    } else {
      saveData(iconName, title, reportData, navigation);
    }
  }, [reportData, iconName, title, navigation]);

  return (
    <Card style={styles.container}>
      <Card.Title title="Confirm sending" titleStyle={styles.title} />
      <Card.Content>
        <ThemedView>
          <Text style={styles.text}>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
          </Text>
        </ThemedView>
        <ThemedView>
          <Button title="Send" onPress={handleSend} />
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
  },
  text: {
    marginBottom: 30
  }
});
