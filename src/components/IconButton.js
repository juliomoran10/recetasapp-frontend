import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/common';

const IconButton = ({ name, size = 20, color = COLORS.primary, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Ionicons name={name} size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { padding: 8 }
});

export default IconButton;
