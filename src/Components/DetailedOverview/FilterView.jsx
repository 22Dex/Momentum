import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TIME_SECTIONS } from "../../data/appData";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes";

export default function FilterView({ activeFilter, setActiveFilter }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterBar}
      contentContainerStyle={styles.filterBarContent}
    >
      <TouchableOpacity
        style={[
          styles.filterBtn,
          activeFilter === null && styles.filterBtnActive,
        ]}
        onPress={() => setActiveFilter(null)}
      >
        <Text style={styles.filterBtnText}>All</Text>
      </TouchableOpacity>

      {TIME_SECTIONS.map((section) => (
        <TouchableOpacity
          key={section.id}
          style={[
            styles.filterBtn,
            activeFilter === section.id && styles.filterBtnActive,
            activeFilter === section.id && { borderColor: section.color },
          ]}
          onPress={() =>
            setActiveFilter(activeFilter === section.id ? null : section.id)
          }
        >
          <Text style={styles.filterBtnText}>
            {section.emoji} {section.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    marginBottom: SPACING.md,
  },
  filterBarContent: {
    gap: SPACING.sm,
    paddingRight: SPACING.md,
  },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.cardBorder,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
  },
});
