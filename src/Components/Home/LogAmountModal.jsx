import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function LogAmountModal({
  visible,
  onClose,
  habit,
  loggingAmount,
  setLoggingAmount,
  onLog,
  styles,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>Log {habit ? habit.title : 'Amount'}</Text>
          {habit && habit.unit && (
            <Text style={styles.modalSection}>Unit: {habit.unit}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder={habit && habit.unit ? `Amount (${habit.unit})` : 'Amount'}
            placeholderTextColor={styles.placeholderColor || "#8c8176"}
            keyboardType="numeric"
            value={String(loggingAmount)}
            onChangeText={setLoggingAmount}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={onLog}>
              <Text style={styles.saveBtnText}>Log</Text>
            </TouchableOpacity>
          </View>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
