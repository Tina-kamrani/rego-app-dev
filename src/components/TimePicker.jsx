import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { TextInput as PaperInput } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { theme } from "@/src/core/theme";
import MaskInput from "react-native-mask-input";

export default function TimePicker({ label, time, description, onTimeChange, date, hasError = false }) {
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [visible, setVisible] = useState(false);
  const mask = [/\d/, /\d/, ':', /\d/, /\d/];

  const onDismiss = () => {
    setVisible(false);
  };

  const onConfirm = ({ hours, minutes }) => {
    setVisible(false);
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    const selectedDateTime = date ? new Date(date) : new Date();
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date(); // Get current date & time

    if (selectedDateTime > now) {
      // Show alert in Finnish if time is in the future
      Alert.alert("Virhe", "Tapahtuman aika ei voi olla tulevaisuudessa!", [{ text: "OK" }]);
      return;
    }

    if (onTimeChange) {
      onTimeChange(formattedTime);
    }
  };

  useEffect(() => {
    if (time) {
      const [hour, min] = time.split(":");
      setHour(Number(hour));
      setMin(Number(min));
    }
  }, [time]);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setVisible(true)}>
        <PaperInput
          disabled={true}
          mode="flat"
          placeholder="Tapahtuma-aika* (HH:MM)"
          value={time}
          outlineColor={theme.colors.border}
          activeOutlineColor={theme.colors.primary}
          placeholderTextColor={hasError ? theme.colors.errorBoundaryColor : theme.colors.timePickerTextColor}
          textColor={theme.colors.border}
          error={hasError}
          style={{ backgroundColor: theme.colors.background }}
          right={
            <PaperInput.Icon
              icon="clock"
              onPress={() => setVisible(true)}
              color={theme.colors.border}
            />
          }
          render={(props) => (
            <MaskInput
              {...props}
              mask={mask}
              keyboardType="numeric"
              value={time}
              onChangeText={(masked) => {
                onTimeChange(masked);
                const [hour, min] = masked.split(":");
                setHour(Number(hour));
                setMin(Number(min));
              }}
            />
          )}

        />
      </Pressable>

      <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={hour}
        minutes={min}
        label="Select time"
        cancelLabel="Cancel"
        confirmLabel="Ok"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
});
