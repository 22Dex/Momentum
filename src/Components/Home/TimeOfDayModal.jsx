import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { TIME_SECTIONS } from '../../data/appData';

export default function TimeOfDayModal({ visible, onClose, selectedId, onSelect, styles }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Choose Time of Day</Text>
          <View style={{ marginTop: 12 }}>
            {TIME_SECTIONS.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.priorityBtn, selectedId === s.id && styles.priorityBtnActive, { marginBottom: 8 }]}
                onPress={() => {
                  onSelect(s.id);
                  onClose();
                }}
              >
                <Text style={styles.priorityBtnText}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
