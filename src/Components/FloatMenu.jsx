import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const RADIUS = 70;

const MENU_ITEMS = [
  { icon: 'person-outline', route: '/Account', angle: 90 },
  { icon: 'settings-outline', route: '/settings', angle: 150 },
];

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.wrapper}>
        {MENU_ITEMS.map((item, i) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = Math.cos(rad) * RADIUS;
          const y = Math.sin(rad) * RADIUS;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuItem,
                {
                  position: 'absolute',
                  right: 28 + (-x) - 26,
                  top: 28 + y - 26,
                  opacity: open ? 1 : 0,
                  pointerEvents: open ? 'auto' : 'none',
                  transform: [{ scale: open ? 1 : 0 }],
                },
              ]}
              onPress={() => { router.push(item.route); setOpen(false); }}
            >
              <Ionicons name={item.icon} size={22} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.plusButton}
          activeOpacity={0.8}
          onPress={() => setOpen(!open)}
        >
          <View style={styles.plusButtonSheen} pointerEvents="none" />
          <Ionicons name={open ? 'close' : 'add'} size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    width: 200,
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  wrapper: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 16,
    overflow: 'visible',
  },

  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(168, 85, 247, 0.9)',
    borderWidth: 0.75,
    borderColor: 'rgba(255, 255, 255, 0.30)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 16,
    zIndex: 1000,
  },

  plusButtonSheen: {
    position: 'absolute',
    top: 5,
    left: 8,
    right: 8,
    height: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
  },

  menuItem: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 0.75,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderTopColor: 'rgba(255, 255, 255, 0.32)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.30,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 999,
  },
});