import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates';
import { theme } from '../core/theme';

registerTranslation('en', en);
registerTranslation('fi', {
  save: 'Tallenna',
  selectSingle: 'Valitse päivämäärä',
  selectMultiple: 'Valitse päivämäärät',
  selectRange: 'Valitse ajanjakso',
  notAccordingToDateFormat: (inputFormat) =>
    `Päivämäärän muodon tulee olla ${inputFormat}`,
  mustBeHigherThan: (date) => `Päivämäärän tulee olla myöhemmin kuin ${date}`,
  mustBeLowerThan: (date) => `Päivämäärän tulee olla aikaisemmin kuin ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Päivämäärän tulee olla välillä ${startDate} - ${endDate}`,
  dateIsDisabled: 'Päivämäärä ei ole sallittu',
  previous: 'Edellinen',
  next: 'Seuraava',
  typeInDate: 'Kirjoita päivämäärä',
  pickDateFromCalendar: 'Valitse päivämäärä kalenterista',
  close: 'Sulje',
  minute: 'Minuutti',
  hour: 'Tunti',
});

export default function DatePickers({ label, date, onDateChange, hasError }) {
  const [visible, setVisible] = useState(false);

  const onConfirm = (params) => {
    if (!params || !params.date) 
      return;
    
    const newDate = params.date;
    const today = new Date();
    
    if (newDate <= today) {
      onDateChange(newDate);
    } else {
      Alert.alert("Virhe", "Tapahtuman aika ei voi olla tulevaisuudessa!", [{ text: "OK" }]);
    }
    setVisible(false);
  };

  const onChange = (params) => {
    if (!params) 
      return;
    const newDate = new Date(params);
    const today = new Date();
    
    if (newDate <= today) {
      onDateChange(newDate);
    } else {
      Alert.alert("Virhe", "Tapahtuman aika ei voi olla tulevaisuudessa!", [{ text: "OK" }]);
    }
    setVisible(false);
  }

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridItem}>

        <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={1}>
          <DatePickerInput
            inputEnabled={false} // Prevent manual typing
            label={label}
            value={date}
            mode="flat"
            locale="fi"
            minimumDate={new Date(0)}
            maximumDate={new Date()}
            inputMode="start"
            hasError={hasError}
            style={{ backgroundColor: theme.colors.background }}
            textColor={theme.colors.border}
            iconColor={theme.colors.border}
            onChange={onChange}
          />
        </TouchableOpacity>

        {/* Date Picker Modal */}
        <DatePickerModal
          mode="single"
          visible={visible}
          onDismiss={() => setVisible(false)}
          date={date}
          onConfirm={onConfirm} // Only update date when selecting in modal
          locale="fi"
          startWeekOn={1} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gridItem: {
    marginBottom: 20,
  },
});
