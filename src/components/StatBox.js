import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/common';

const StatBox = ({ icon = 'restaurant', color = COLORS.primary, number = 0, label = '' }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1 },
  number: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 6 },
  label: { fontSize: 12, color: 'gray', marginTop: 4 }
});

export default StatBox;
