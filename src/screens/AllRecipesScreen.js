import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_RECIPES } from '../data/mockData';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { commonStyles } from '../styles/common';

const AllRecipesScreen = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const groupName = route.params?.groupName;
  const groupId = route.params?.groupId;

  const sortedRecipes = [...MOCK_RECIPES].sort((a, b) => 
    a.title.localeCompare(b.title)
  );

  const groupFilteredRecipes = groupId 
    ? sortedRecipes.filter((_, index) => groupId === "1" ? index % 2 === 0 : index % 2 !== 0)
    : sortedRecipes;

  const filteredRecipes = groupFilteredRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(search.toLowerCase()) ||
    recipe.description.toLowerCase().includes(search.toLowerCase())
  );

  const renderGlobalRecipeCard = ({ item }) => (
    <RecipeCard item={item} onPress={() => navigation.navigate('RecipeDetail', { recipe: item })} />
  );

  return (
    <View style={styles.container}>
      <Header
        title={groupName ? `Recetas de: ${groupName}` : 'Recetas'}
        showBack={!!groupName}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          placeholder={groupName ? `Buscar en ${groupName}...` : "Buscar recetas globales..."}
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderGlobalRecipeCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay recetas en este grupo que coincidan.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...commonStyles.pageContainer },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  backButton: { padding: 5, marginRight: 15 },
  groupHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#051C60' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    margin: 15,
    height: 45,
    borderRadius: 8,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#333', fontSize: 15 },
  listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3B71F3', 
  },
  cardContent: { padding: 15 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#051C60', marginBottom: 5 },
  recipeDescription: { fontSize: 14, color: 'gray', marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recipeTime: { fontSize: 13, color: '#555', fontWeight: '600' },
  viewButton: { flexDirection: 'row', alignItems: 'center' },
  viewButtonText: { color: '#3B71F3', fontSize: 14, fontWeight: 'bold', marginRight: 3 },
  emptyText: { textAlign: 'center', color: 'gray', marginTop: 40, fontSize: 15, fontStyle: 'italic' },
});

export default AllRecipesScreen;