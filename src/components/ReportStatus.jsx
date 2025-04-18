import { StyleSheet, View, Text } from 'react-native';
import ExpoIcon from './ExpoIcon';
import i18n from '../core/i18n';
import { theme } from '../core/theme';

const ReportStatus = ({ reportType, reportId, status }) => {
    let reportStatusIconBackColor = status === 'waiting' ? '#FFF3C2' : '#D2FFC2';
    let reportStatusIconBorderColor = status === 'waiting' ? '#FBD84B' : '#84E561';

    const getStatusIcon = () => {
      switch (status) {
        case 'waiting':
          return <ExpoIcon name="alert-triangle" iconSet="Feather" size={16} color="black" />;
        case 'sent':
          return <ExpoIcon name="check" iconSet="Feather" size={16} color="black" />;
        default:
          return null;
      }
    };
  
    return (
      <View style={styles.reportStatus}>
        <View>
            <Text style={styles.reportStatusText}>
            {reportType}
            </Text>
            <Text style={styles.reportStatusId}>
                {'#' + reportId}
            </Text>
        </View>
        <View style={[styles.reportStatusIcon, { backgroundColor: reportStatusIconBackColor, borderColor: reportStatusIconBorderColor }]}>
          {getStatusIcon()}
          <Text style={styles.statusText}>{i18n.t(status)}</Text>
        </View>
      </View>
    );
};

export default ReportStatus;

const styles = StyleSheet.create({
    reportStatus: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB'
    },
    reportStatusText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    reportStatusId: {
        fontSize: 12,
        color: '#44464B',
    },
    reportStatusIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderRadius: 30
    },
    statusText: {
      marginLeft: 5,
      fontSize: 12,
    },
});