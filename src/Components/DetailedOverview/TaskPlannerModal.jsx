import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function TaskPlannerModal({
  visible,
  onClose,
  onCancel,
  onSave,
  onOpenDatePicker,
  onOpenTimePicker,
  planTaskTitle,
  setPlanTaskTitle,
  planTaskDate,
  planTaskStartTime,
  planTaskEndTime,
  planTaskCalendar,
  setPlanTaskCalendar,
  planTaskXp,
  setPlanTaskXp,
  planTaskNotes,
  setPlanTaskNotes,
  styles,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Plan task</Text>

            <TextInput
              style={styles.input}
              value={planTaskTitle}
              onChangeText={setPlanTaskTitle}
              placeholder="Task title"
              placeholderTextColor={styles.placeholderText?.color || "#8d8d8d"}
            />

            <View style={styles.inlineToggleRow}>
              <Text style={styles.sectionLabel}>Add to calendar?</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setPlanTaskCalendar((prev) => !prev)}
                style={[
                  styles.switchTrack,
                  planTaskCalendar && styles.switchTrackActive,
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    planTaskCalendar && styles.switchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.input, styles.inputButton, styles.dateField]}
              onPress={onOpenDatePicker}
            >
              <Text
                style={[
                  styles.inputText,
                  !planTaskDate && styles.placeholderText,
                ]}
              >
                {planTaskDate || "Date"}
              </Text>
            </TouchableOpacity>

            <View style={styles.rowTwo}>
              <TouchableOpacity
                style={[styles.input, styles.inputHalf, styles.inputButton]}
                onPress={() => onOpenTimePicker("start")}
              >
                <Text
                  style={[
                    styles.inputText,
                    !planTaskStartTime && styles.placeholderText,
                  ]}
                >
                  {planTaskStartTime ? `Start ${planTaskStartTime}` : "Start"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.input, styles.inputHalf, styles.inputButton]}
                onPress={() => onOpenTimePicker("end")}
              >
                <Text
                  style={[
                    styles.inputText,
                    !planTaskEndTime && styles.placeholderText,
                  ]}
                >
                  {planTaskEndTime ? `End ${planTaskEndTime}` : "End"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>XP level</Text>
            <View style={styles.xpRow}>
              {[
                { key: "easy", label: "Easy" },
                { key: "medium", label: "Medium" },
                { key: "hard", label: "Hard" },
              ].map((level) => (
                <TouchableOpacity
                  key={level.key}
                  style={[
                    styles.xpButton,
                    planTaskXp === level.key && styles.xpButtonActive,
                  ]}
                  onPress={() => setPlanTaskXp(level.key)}
                >
                  <Text
                    style={[
                      styles.xpButtonText,
                      planTaskXp === level.key && styles.xpButtonTextActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.notesInput]}
              value={planTaskNotes}
              onChangeText={setPlanTaskNotes}
              placeholder="Notes, location, or anything else"
              placeholderTextColor={styles.placeholderText?.color || "#8d8d8d"}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
