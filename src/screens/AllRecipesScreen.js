import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { commonStyles } from '../styles/common';
import { listRecipesApi } from '../services/recipesApi';
import { getAuthErrorMessage } from '../services/authMessages';

const AllRecipesScreen = () => {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();

  const groupName = route.params?.groupName;
  const groupId = route.params?.groupId;

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const result = await listRecipesApi({ groupId });
      setRecipes(result.recipes || []);
    } catch (error) {
      Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes])
  );

  const filteredRecipes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return recipes;
    }

    return recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(term) ||
        String(recipe.description || '').toLowerCase().includes(term)
    );
  }, [recipes, search]);

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
          placeholder={groupName ? `Buscar en ${groupName}...` : 'Buscar recetas globales...'}
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

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3B71F3" />
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={renderGlobalRecipeCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay recetas que coincidan.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...commonStyles.pageContainer },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
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
    shadowRadius: 2
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#333', fontSize: 15 },
  listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: 'gray', marginTop: 40, fontSize: 15, fontStyle: 'italic' }
});

export default AllRecipesScreen;
