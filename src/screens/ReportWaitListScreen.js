import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { deleteReport, getReports } from "@/database/ReportData";
import ReportStatus from "../components/ReportStatus";
import i18n from "../core/i18n";
import ExpoIcon from "../components/ExpoIcon";
import { checkServerConnectivity, sendDataToServer, sendFilesToServer } from "../core/server";
import { AuthContext } from "@/app/authContext";
import { theme } from "../core/theme";
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from "@react-navigation/native";

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

const ReportWaitListScreen = ({ setLoading, loading }) => {
  const { userdata } = useContext(AuthContext);
  const [list, setList] = useState([]);

  // Fetch reports function now available outside of useEffect
  const fetchReports = async () => {
    try {
      const reportList = await getReports();
      
      if (list.length !== reportList.length) {
        setList(reportList);
      }
      return reportList;
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
  };

  const clearList = async () => {
    setLoading(true);
    await Promise.all(
      list.map(async (report) => {
        await deleteReport(report.id);
      })
    );
    await fetchReports();
    setLoading(false);
  }

  const uploadList = async (reportsToUpload = list) => {
    if (loading || reportsToUpload.length === 0) {
      return;
    }
  
    try {
      const netstatus = await checkServerConnectivity();

      if (loading) {
        return;
      }

      if (netstatus) {

        try {
          setLoading(true);
          const token = userdata.token_type + ' ' + userdata.access_token;

          await Promise.all(
            reportsToUpload.map(async (report) => {
              let data = report;

              try {
                const response = await sendDataToServer(data, token);

                if (!response.ok) {
                  throw new Error(`Server error: ${response.status}`);
                }

                const responseData = await response.json();

                if (data.Files.length > 0) {
                  const fileUploadStatus = await sendFilesToServer(
                    { ...data, Id: responseData.Id, Files: data.Files },
                    token
                  );

                  if (!fileUploadStatus) {
                    throw new Error("Failed to upload files");
                  }
                }

                await deleteReport(report.id);
              } catch (error) {
                console.error("Error sending data to the server:", error);
              }
            })
          ).then(() => {
            setList([])
            showToast("", `Ilmoitukset lähetetty onnistuneesti`);
          })
        } catch (error) {
          console.error("Error in onRefresh:", error);
        } finally {
          setLoading(false); // Ensure loading state is reset
        }
      }
    } catch (error) {
      console.error("Error checking server connectivity:", error);
    }
  };

  const prevIsConnected = useRef(false); // Tracks previous state

  useEffect(() => {
  
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && state.isInternetReachable) {
        if (!prevIsConnected.current) {
          prevIsConnected.current = true; // Update to prevent re-triggering
          const latestReports = await fetchReports();
          uploadList(latestReports);
        }
      } else {
        prevIsConnected.current = false; // Reset when connection is lost
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  useFocusEffect(
      React.useCallback(() => {
        fetchReports();
      }, [])
  );

  const report_data = list.map((report, index) => {
    let reportType = i18n.t('safetyFinding');

    if (report.EntityType === 3) {
      reportType = i18n.t('workAccident');
    }

    const reportTitleToNumber = {
      "Turvallisuushavainto": 1,
      "Työtapaturma tai läheltä-piti": 2,
      "Turvallisuuspoikkeama": 3,
    }

    reportType = `${reportTitleToNumber[report.ReportTitle]}. ${report.ReportTitle}`;

    const status = report.sendStatus === 'pending' ? 'waiting' : 'sent';

    return <ReportStatus reportType={reportType} reportId={report.id} status={status} key={index} />;
  });

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{i18n.t('reportWaitingList')} ({list.length.toString()})</Text>
        <View>
          <TouchableOpacity style={styles.refreshButton} onPress={uploadList}>
            <ExpoIcon name="refresh" iconSet="SimpleLineIcons" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.refreshButton} onPress={clearList}>
            <ExpoIcon name="trash" iconSet="SimpleLineIcons" size={20} color={theme.colors.text} />
          </TouchableOpacity> */}
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {report_data}
      </ScrollView>
    </View>
  );
};

export default ReportWaitListScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    // color: '#1D1E20',
    color: theme.colors.text,
  },
  refreshButton: {
    padding: 5,
  },
});
