import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/common';

const ActionRow = ({ icon, text, onPress, tint = COLORS.text, rightIcon = 'chevron-forward' }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.left}>
      {icon && <Ionicons name={icon} size={20} color={tint} style={{ marginRight: 12 }} />}
      <Text style={[styles.text, { color: tint }]}>{text}</Text>
    </View>
    <Ionicons name={rightIcon} size={18} color="gray" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  left: { flexDirection: 'row', alignItems: 'center' },
  text: { fontSize: 15, fontWeight: '500' }
});

export default ActionRow;
