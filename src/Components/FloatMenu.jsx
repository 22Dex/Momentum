import { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../theme/Themes';

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {open && (
        <View
          style={{
            position: 'absolute',
            bottom: 130,
            alignSelf: 'center',
            gap: 12,
            zIndex: 100,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/settings')}
          >
            <Text>⚙️ Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/stats')}
          >
            <Text>📊 Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/goals')}
          >
            <Text>🎯 Goals</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          position: 'absolute',
          bottom: 80,
          alignSelf: 'center',
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: COLORS.primary,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 101,
        }}
      >
        <Text style={{ fontSize: 28, color: 'white' }}>
          {open ? '✕' : '+'}
        </Text>
      </TouchableOpacity>
    </>
  );
}