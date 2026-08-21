import { useEffect } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function TimePickerModal({
  visible,
  onClose,
  hourOptions,
  minuteOptions,
  timePickerHour,
  setTimePickerHour,
  timePickerMinute,
  setTimePickerMinute,
  timePickerMeridiem,
  setTimePickerMeridiem,
  timePickerMode,
  timePickerValue,
  onSave,
  styles,
  parseTimeValue,
  formatTimeValue,
  hourWheelRef,
  minuteWheelRef,
}) {
  const buildWheelWindow = (values, selectedValue) => {
    const selectedIndex = values.indexOf(selectedValue);
    const startIndex = selectedIndex >= 0 ? selectedIndex - 2 : 0;

    return Array.from({ length: 5 }, (_, offset) => {
      const index = (startIndex + offset + values.length) % values.length;
      return values[index];
    });
  };

  const hourWindowValues = buildWheelWindow(hourOptions, timePickerHour);
  const minuteWindowValues = buildWheelWindow(minuteOptions, timePickerMinute);

  useEffect(() => {
    if (!visible) return;

    const parsed = parseTimeValue(timePickerValue || "09:00");
    setTimePickerHour(parsed.hour);
    setTimePickerMinute(parsed.minute);
    setTimePickerMeridiem(parsed.meridiem);

    const hourIndex = hourOptions.indexOf(parsed.hour);
    const minuteIndex = minuteOptions.indexOf(parsed.minute);
    const hourY = Math.max(0, ((hourIndex >= 0 ? hourIndex : 0) + 2) * 28);
    const minuteY = Math.max(0, ((minuteIndex >= 0 ? minuteIndex : 0) + 2) * 28);

    requestAnimationFrame(() => {
      hourWheelRef?.current?.scrollTo({ y: hourY, animated: false });
      minuteWheelRef?.current?.scrollTo({ y: minuteY, animated: false });
    });
  }, [
    visible,
    timePickerValue,
    hourOptions,
    minuteOptions,
    hourWheelRef,
    minuteWheelRef,
    parseTimeValue,
    setTimePickerHour,
    setTimePickerMinute,
    setTimePickerMeridiem,
  ]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.pickerOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.timePickerCard}>
            <Text style={styles.pickerTitle}>
              {timePickerMode === "start" ? "Start time" : "End time"}
            </Text>

            <View style={styles.timePickerPanel}>
              <View style={styles.timeWheelHighlight} pointerEvents="none" />

              <View style={styles.timeWheelColumn}>
                <ScrollView
                  ref={hourWheelRef}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.timeWheelContent}
                  snapToInterval={28}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  scrollEventThrottle={24}
                  onMomentumScrollEnd={(event) => {
                    const y = event.nativeEvent.contentOffset.y;
                    const index = Math.min(
                      hourWindowValues.length - 1,
                      Math.max(0, Math.round(y / 28)),
                    );
                    const nextHour = hourWindowValues[index];
                    if (nextHour !== undefined && nextHour !== timePickerHour) {
                      setTimePickerHour(nextHour);
                    }
                  }}
                  onLayout={() => {
                    const parsed = parseTimeValue(timePickerValue || "09:00");
                    const y = Math.max(0, 2 * 28);
                    hourWheelRef.current?.scrollTo({ y, animated: false });
                  }}
                >
                  {hourWindowValues.map((hour) => (
                    <TouchableOpacity
                      key={`${hour}-${timePickerHour}`}
                      style={[
                        styles.timeWheelItem,
                        timePickerHour === hour && styles.timeWheelItemSelected,
                      ]}
                      onPress={() => setTimePickerHour(hour)}
                    >
                      <Text
                        style={[
                          styles.timeWheelText,
                          timePickerHour === hour &&
                            styles.timeWheelTextSelected,
                        ]}
                      >
                        {String(hour).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.timeSeparatorColumn}>
                <Text style={styles.timeSeparator}>:</Text>
              </View>

              <View style={styles.timeMinutesColumn}>
                <ScrollView
                  ref={minuteWheelRef}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.timeWheelContent}
                  snapToInterval={28}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  scrollEventThrottle={24}
                  onMomentumScrollEnd={(event) => {
                    const y = event.nativeEvent.contentOffset.y;
                    const index = Math.min(
                      minuteWindowValues.length - 1,
                      Math.max(0, Math.round(y / 28)),
                    );
                    const nextMinute = minuteWindowValues[index];
                    if (
                      nextMinute !== undefined &&
                      nextMinute !== timePickerMinute
                    ) {
                      setTimePickerMinute(nextMinute);
                    }
                  }}
                  onLayout={() => {
                    const parsed = parseTimeValue(timePickerValue || "09:00");
                    const y = Math.max(0, 2 * 28);
                    minuteWheelRef.current?.scrollTo({ y, animated: false });
                  }}
                >
                  {minuteWindowValues.map((minute) => (
                    <TouchableOpacity
                      key={`${minute}-${timePickerMinute}`}
                      style={[
                        styles.timeWheelItem,
                        timePickerMinute === minute &&
                          styles.timeWheelItemSelected,
                      ]}
                      onPress={() => setTimePickerMinute(minute)}
                    >
                      <Text
                        style={[
                          styles.timeWheelText,
                          timePickerMinute === minute &&
                            styles.timeWheelTextSelected,
                        ]}
                      >
                        {String(minute).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.ampmRow}>
              {["AM", "PM"].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.ampmButton,
                    timePickerMeridiem === period &&
                      (period === "AM"
                        ? styles.amButtonSelected
                        : styles.pmButtonSelected),
                  ]}
                  onPress={() => setTimePickerMeridiem(period)}
                >
                  <Text
                    style={[
                      styles.ampmButtonText,
                      timePickerMeridiem === period &&
                        (period === "AM"
                          ? styles.amTextSelected
                          : styles.pmTextSelected),
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  onSave(
                    formatTimeValue(
                      timePickerHour,
                      timePickerMinute,
                      timePickerMeridiem,
                    ),
                  );
                }}
              >
                <Text style={styles.saveButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
