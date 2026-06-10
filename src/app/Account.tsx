import { View, Text, StyleSheet } from 'react-native';

export default function Account() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
  },
});