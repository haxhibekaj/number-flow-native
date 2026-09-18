import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NumberFlow, { continuous } from 'number-flow-native';

const TICK_MS = 1500;

const randomPrice = () => Math.round(Math.random() * 200000) / 100;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function App() {
  const [value, setValue] = useState(1234.56);
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(55);
  const [isAnimated, setIsAnimated] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s + 1) % 60), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setValue(randomPrice()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="auto" />
      <Text style={styles.title}>number-flow-native</Text>

      <Row label="Currency, random every 1.5s">
        <NumberFlow
          value={value}
          format={{ style: 'currency', currency: 'USD' }}
          animated={isAnimated}
          style={styles.big}
        />
      </Row>

      <Row label="Compact with suffix">
        <NumberFlow
          value={value * 1000}
          format={{ notation: 'compact', maximumFractionDigits: 1 }}
          suffix=" views"
          animated={isAnimated}
          style={styles.medium}
        />
      </Row>

      <Row label="Counter with continuous plugin">
        <View style={styles.counter}>
          <Pressable style={styles.button} onPress={() => setCount((c) => c - 1)}>
            <Text style={styles.buttonText}>−</Text>
          </Pressable>
          <NumberFlow
            value={count}
            plugins={[continuous]}
            animated={isAnimated}
            style={styles.medium}
            format={{ signDisplay: 'exceptZero' }}
          />
          <Pressable style={styles.button} onPress={() => setCount((c) => c + 1)}>
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      </Row>

      <Row label="Seconds, digits max so 59 → 00">
        <NumberFlow
          value={seconds}
          digits={{ 1: { max: 5 } }}
          trend={1}
          format={{ minimumIntegerDigits: 2 }}
          animated={isAnimated}
          style={styles.medium}
        />
      </Row>

      <Row label="Animated">
        <Switch value={isAnimated} onValueChange={setIsAnimated} />
      </Row>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, gap: 28, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginTop: 16 },
  row: { gap: 8 },
  label: { fontSize: 13, color: '#666' },
  big: { fontSize: 48, fontWeight: '700', color: '#111' },
  medium: { fontSize: 32, fontWeight: '600', color: '#111' },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 22, fontWeight: '600' },
});
