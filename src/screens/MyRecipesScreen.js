import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_RECIPES } from '../data/mockData'; 
import { useNavigation } from '@react-navigation/native';
import RecipeCard from '../components/RecipeCard';
import Header from '../components/Header';
import { commonStyles } from '../styles/common';

const MyRecipesScreen = () => {
  const navigation = useNavigation();

  const renderRecipeCard = ({ item }) => (
    <RecipeCard item={item} onPress={() => navigation.navigate('RecipeDetail', { recipe: item })} />
  );

  return (
    <View style={[styles.container]}>
      <Header title="Mis Recetas" />
      <FlatList
        data={MOCK_RECIPES} 
        keyExtractor={(item) => item.id} 
        renderItem={renderRecipeCard} 
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 80, 
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#051C60',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  recipeTime: {
    fontSize: 12,
    color: '#3B71F3',
    fontWeight: 'bold',
  },
  actions: {
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 5,
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
    shadowRadius: 3,
  }
});

export default MyRecipesScreen;