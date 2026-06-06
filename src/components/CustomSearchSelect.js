import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomSearchSelect = ({ 
  placeholder = "Buscar...", 
  label, 
  data = [], 
  selectedItems = [], 
  onAddItem, 
  onRemoveItem,
  searchKey = "name"
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(item => 
    item[searchKey].toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedItems.some(selected => selected.id === item.id)
  );

  const handleSelect = (item) => {
    onAddItem(item);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.searchSection}>
        <Ionicons name="search" size={20} color="gray" style={{ marginRight: 10 }} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredData.length === 0 ? (
            <Text style={styles.noResultsText}>No se encontraron resultados</Text>
          ) : (
            filteredData.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.suggestionRow}
                onPress={() => handleSelect(item)}
              >
                <Ionicons name="pricetag-outline" size={18} color="#3B71F3" />
                <Text style={styles.suggestionText}>{item[searchKey]}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {selectedItems.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedItems.map(item => (
            <View key={item.id} style={styles.chip}>
              <Text style={styles.chipText}>{item[searchKey]}</Text>
              <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
                <Ionicons name="close-circle" size={18} color="#e3342f" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginTop: 10 },
  label: { fontSize: 14, fontWeight: 'bold', color: 'gray', marginBottom: 5, marginLeft: 5 },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: { flex: 1, color: '#333', fontSize: 15 },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 2,
    maxHeight: 150,
    zIndex: 99,
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 },
  suggestionText: { marginLeft: 10, fontSize: 15, color: '#333' },
  noResultsText: { padding: 12, color: 'gray', fontStyle: 'italic', textAlign: 'center' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7EAF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderColor: '#3B71F3',
    borderWidth: 0.5,
  },
  chipText: { color: '#4765A9', fontSize: 14, fontWeight: '500' },
});

export default CustomSearchSelect;