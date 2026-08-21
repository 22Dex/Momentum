import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  { icon: "timer-outline", route: "/More" },
  { icon: "person-outline", route: "/Account" },
  { icon: "settings-outline", route: "/settings" },
];

export default function FloatingMenu() {
  const router = useRouter();

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.pill}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
            activeOpacity={0.8}
          >
            <Ionicons name={item.icon} size={18} color="#F3EDE3" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -85 }],
    zIndex: 20,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#2B241D",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  menuItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2B241D",
    justifyContent: "center",
    alignItems: "center",
  },
});
