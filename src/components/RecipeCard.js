import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/common';

const RecipeCard = ({ item, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>{item.description}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.recipeTime}>⏱ {item.time}</Text>

          <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>Ver receta</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardContent: { padding: 15 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 5 },
  recipeDescription: { fontSize: 14, color: 'gray', marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recipeTime: { fontSize: 13, color: '#555', fontWeight: '600' },
  viewButton: { flexDirection: 'row', alignItems: 'center' },
  viewButtonText: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold', marginRight: 3 },
});

export default RecipeCard;
