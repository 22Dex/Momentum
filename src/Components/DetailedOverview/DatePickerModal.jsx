import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function DatePickerModal({
  visible,
  onClose,
  today,
  value,
  onSelect,
  styles,
}) {
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
          <View style={styles.miniMonthCard}>
            <Text style={styles.pickerTitle}>Choose date</Text>
            <Calendar
              current={value || today}
              onDayPress={(day) => {
                onSelect(day.dateString);
              }}
              markedDates={{
                [value]: {
                  selected: true,
                  selectedColor: styles.primaryColor || "#d4a54d",
                  selectedTextColor: "#151515",
                },
              }}
              hideExtraDays
              monthFormat="MMMM yyyy"
              style={styles.miniCalendar}
              theme={{
                backgroundColor: "#1b1b1b",
                calendarBackground: "#1b1b1b",
                textSectionTitleColor: "#c9c9c9",
                dayTextColor: "#f2f2f2",
                monthTextColor: "#f2f2f2",
                arrowColor: "#d4a54d",
                selectedDayBackgroundColor: "#d4a54d",
                selectedDayTextColor: "#151515",
                textDisabledColor: "#686868",
                todayTextColor: "#d4a54d",
                textMonthFontWeight: "600",
              }}
            />
            <TouchableOpacity
              style={styles.closePickerButton}
              onPress={onClose}
            >
              <Text style={styles.closePickerButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const StyleSheet = require("react-native").StyleSheet;
