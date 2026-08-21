import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function AddHabitModal({
  visible,
  onClose,
  activeSectionLabel,
  newHabitTitle,
  setNewHabitTitle,
  onAddHabit,
  newHabitMeasureType,
  setNewHabitMeasureType,
  newHabitGoalAmount,
  setNewHabitGoalAmount,
  newHabitUnit,
  setNewHabitUnit,
  newHabitDifficulty,
  setNewHabitDifficulty,
  styles,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>New Habit</Text>
          <Text style={styles.modalSection}>Section: {activeSectionLabel}</Text>
          <TextInput
            style={styles.input}
            placeholder="Habit name (e.g. Morning Run)"
            placeholderTextColor={styles.placeholderColor || "#8c8176"}
            value={newHabitTitle}
            onChangeText={setNewHabitTitle}
          />
          {/* XP is calculated from difficulty — manual XP input removed */}
          <Text style={styles.inputLabel}>Difficulty:</Text>
          <View style={styles.priorityRow}>
            {['easy','medium','hard'].map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.priorityBtn,
                  newHabitDifficulty === d && styles.priorityBtnActive,
                ]}
                onPress={() => setNewHabitDifficulty(d)}
              >
                <Text style={styles.priorityBtnText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Measure:</Text>
          <View style={styles.priorityRow}>
            {['streak','amount'].map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.priorityBtn,
                  newHabitMeasureType === m && styles.priorityBtnActive,
                ]}
                onPress={() => setNewHabitMeasureType(m)}
              >
                <Text style={styles.priorityBtnText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {newHabitMeasureType === 'amount' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Goal amount (e.g. 10)"
                placeholderTextColor={styles.placeholderColor || "#8c8176"}
                keyboardType="numeric"
                value={String(newHabitGoalAmount)}
                onChangeText={(t) => setNewHabitGoalAmount(parseFloat(t) || 0)}
              />
              <TextInput
                style={styles.input}
                placeholder="Unit (e.g. pages, mi)"
                placeholderTextColor={styles.placeholderColor || "#8c8176"}
                value={newHabitUnit}
                onChangeText={setNewHabitUnit}
              />
            </>
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={onAddHabit}>
              <Text style={styles.saveBtnText}>Add Habit</Text>
            </TouchableOpacity>
          </View>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
