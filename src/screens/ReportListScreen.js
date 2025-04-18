import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { deleteReport, getReports } from "@/database/ReportData";
import ReportStatus from "../components/ReportStatus";
import i18n from "../core/i18n";
import ExpoIcon from "../components/ExpoIcon";
import { checkServerConnectivity, sendDataToServer, sendFilesToServer } from "../core/server";
import { AuthContext } from "@/app/authContext";
import { theme } from "../core/theme";

const ReportWaitListScreen = ({ refresh, setLoading }) => {
  const { userdata } = useContext(AuthContext);
  const [list, setList] = useState([]);

  // Fetch reports function now available outside of useEffect
  const fetchReports = async () => {
    setLoading(true);
    try {
        const reportList = await getReports();
        setList(reportList);
    } catch (error) {
        console.error("Error fetching reports:", error);
    } finally {
        setLoading(false); // Reset loading after fetching
    }
  };


  // Load reports on initial render and when 'refresh' prop changes
  useEffect(() => {
    fetchReports();
  }, [refresh]);

  const onRefresh = async () => {
    const token = userdata.token_type + ' ' + userdata.access_token;
    try {
        const netstatus = await checkServerConnectivity();

        if (netstatus) {
            setLoading(true);

            try {
                await Promise.all(
                    list.map(async (report) => {
                        let data;
                        if (report.EntityType === 2) {
                            data = {
                                Name: userdata.username,
                                Email: userdata.userName,
                                UserUnitCode: userdata.unitcode,
                                ClientId: userdata.userId,
                                SelectedUnit: "1",
                                DateHappened: report.DateHappened,
                                TimeHappened: report.TimeHappened,
                                SelectedTargets: [20],
                                EntityType: report.EntityType,
                                Location: report.Location,
                                IsPositive: report.IsPositive,
                                Title: report.Title,
                                Description: report.Description,
                                Reason: report.Reason,
                                Proposal: report.Proposal,
                                IsAdditional: report.IsAdditional,
                                Place: { IsAdditional: true },
                                Layout: "",
                                Files: report.Files,
                                FileNames: report.FileNames,
                            };
                        } else if (report.EntityType === 3) {
                            data = report;
                        }

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

                            // Update the local list and delete successfully sent reports
                            setList((prevList) => prevList.filter((r) => r.id !== report.id));
                            await deleteReport(report.id);
                        } catch (error) {
                            console.error("Error sending data to the server:", error);
                        }
                    })
                );

                // Reload the report list
                await fetchReports();
            } catch (error) {
                console.error("Error in onRefresh:", error);
            } finally {
                setLoading(false); // Ensure loading state is reset
            }
        } else {
            console.warn("No network connectivity");
        }
    } catch (error) {
        console.error("Error checking server connectivity:", error);
        setLoading(false);
    }
  };


  const report_data = list.map((report, index) => {
    let reportType = i18n.t('safetyFinding');

    if (report.EntityType === 3) {
      reportType = i18n.t('workAccident');
    }

    const status = report.sendStatus === 'pending' ? 'waiting' : 'sent';

    return <ReportStatus reportType={reportType} reportId={report.id} status={status} key={index} />;
  });

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{i18n.t('reportWaitingList')} ({list.length.toString()})</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <ExpoIcon name="refresh" iconSet="SimpleLineIcons" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        { report_data }
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
