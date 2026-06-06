import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RecipeCard from '../components/RecipeCard';
import Header from '../components/Header';
import { commonStyles } from '../styles/common';
import { listRecipesApi, deleteRecipeApi } from '../services/recipesApi';
import { getAuthErrorMessage } from '../services/authMessages';

const MyRecipesScreen = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const result = await listRecipesApi({ mine: true });
      setRecipes(result.recipes || []);
    } catch (error) {
      Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes])
  );

  const handleDeleteRecipe = (recipe) => {
    Alert.alert(
      'Eliminar receta',
      `¿Eliminar "${recipe.title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipeApi(recipe.id);
              await loadRecipes();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar la receta.');
            }
          }
        }
      ]
    );
  };

  const renderRecipeCard = ({ item }) => (
    <RecipeCard
      item={item}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      onDelete={item.isOwner ? () => handleDeleteRecipe(item) : undefined}
    />
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3B71F3" />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <Header title="Mis Recetas" />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aún no tienes recetas. Crea la primera con el botón +</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateRecipe')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.pageContainer
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 80
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 40,
    fontSize: 15,
    fontStyle: 'italic'
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3B71F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
});

export default MyRecipesScreen;
