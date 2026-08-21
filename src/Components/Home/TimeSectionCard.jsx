import { Text, TouchableOpacity, View } from "react-native";
import { wasCompletedOn, wasCompletedToday, getHabitBaseXP } from "../../utils/helpers";

export default function TimeSectionCard({
  section,
  sectionHabits,
  sectionTasks,
  weekDates,
  today,
  toggleHabitToday,
  onLogAmountHabit,
  toggleTask,
  openModal,
  formatDueDate,
  styles,
}) {
  return (
    <View key={section.id} style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionEmoji}>{section.emoji}</Text>
          <Text style={styles.sectionTitle}>{section.label}</Text>
          <Text style={styles.sectionTime}>{section.timeRange}</Text>
        </View>
        <View
          style={[styles.sectionAccent, { backgroundColor: section.color }]}
        />
      </View>

      {sectionHabits.map((habit) => (
        <View key={habit.id}>
          <TouchableOpacity
            style={styles.habitRow}
            onPress={() => {
              if (habit.measureType === 'amount' && onLogAmountHabit) {
                onLogAmountHabit(habit);
              } else {
                toggleHabitToday(habit.id);
              }
            }}
          >
            <View
              style={[
                styles.checkCircle,
                wasCompletedToday(habit) && styles.checkCircleDone,
              ]}
            >
              {wasCompletedToday(habit) && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </View>
            <Text style={styles.habitIcon}>{habit.icon}</Text>
            <View style={styles.habitInfo}>
              <Text
                style={[
                  styles.habitTitle,
                  wasCompletedToday(habit) && styles.habitTitleDone,
                ]}
              >
                {habit.title}
              </Text>
              <Text style={styles.habitMeta}>
                🔥 {habit.streak} streak · {habit.measureType === 'amount' ? `${habit.goalAmount}${habit.unit || ''} goal · ` : ''}+{getHabitBaseXP(habit)} XP
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.heatmapRow}>
            {weekDates.map((date) => (
              <View
                key={date}
                style={[
                  styles.heatmapCell,
                  wasCompletedOn(habit, date) && styles.heatmapCompleted,
                ]}
              />
            ))}
          </View>
        </View>
      ))}

      {sectionHabits.length === 0 && sectionTasks.length === 0 && (
        <Text style={styles.emptyText}>No items yet. Add a habit or task!</Text>
      )}

      {sectionTasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskRow}
          onPress={() => toggleTask(task.id)}
        >
          <View
            style={[styles.taskCheck, task.isCompleted && styles.taskCheckDone]}
          >
            {task.isCompleted && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                task.isCompleted && styles.taskTitleDone,
              ]}
            >
              {task.title}
            </Text>
            {task.dueDate && task.dueDate !== today && (
              <Text
                style={[
                  styles.taskDueDate,
                  task.dueDate < today && styles.taskOverdue,
                  task.dueDate > today && styles.taskFuture,
                ]}
              >
                {task.dueDate < today ? "⚠ " : "📅 "}
                {formatDueDate(task.dueDate)}
              </Text>
            )}
          </View>
          {task.priority === "high" && (
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>!</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.addButtonRow}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => openModal("habit", section.id)}
        >
          <Text style={styles.addBtnText}>+ Habit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addBtn, styles.addTaskBtn]}
          onPress={() => openModal("task", section.id)}
        >
          <Text style={styles.addBtnText}>+ Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
