import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddTaskModal({
  visible,
  onClose,
  activeSectionLabel,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDueDate,
  formatDueDate,
  shiftDate,
  setNewTaskDueDate,
  newTaskPriority,
  setNewTaskPriority,
  onAddTask,
  styles,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>New Task</Text>
          <Text style={styles.modalSection}>Section: {activeSectionLabel}</Text>

          <TextInput
            style={styles.input}
            placeholder="Task name (e.g. Reply to emails)"
            placeholderTextColor={styles.placeholderColor || "#8c8176"}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />

          <Text style={styles.inputLabel}>Due Date:</Text>
          <View style={styles.datePicker}>
            <TouchableOpacity
              style={styles.dateArrow}
              onPress={() => setNewTaskDueDate(shiftDate(newTaskDueDate, -1))}
            >
              <Text style={styles.dateArrowText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDueDate(newTaskDueDate)}</Text>
            <TouchableOpacity
              style={styles.dateArrow}
              onPress={() => setNewTaskDueDate(shiftDate(newTaskDueDate, 1))}
            >
              <Text style={styles.dateArrowText}>›</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Priority:</Text>
          <View style={styles.priorityRow}>
            {["low", "normal", "high"].map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityBtn,
                  newTaskPriority === p && styles.priorityBtnActive,
                ]}
                onPress={() => setNewTaskPriority(p)}
              >
                <Text style={styles.priorityBtnText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={onAddTask}>
              <Text style={styles.saveBtnText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
