import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { deleteRecipeApi } from '../services/recipesApi';
import { commonStyles, COLORS } from '../styles/common';

const { width } = Dimensions.get('window');

const RecipeDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { recipe } = route.params;

  const defaultRecipeImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=600&auto=format&fit=crop';

  const handleDelete = () => {
    Alert.alert(
      'Eliminar receta',
      '¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipeApi(recipe.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la receta.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: recipe.image || recipe.recipeImage || defaultRecipeImage }} 
          style={styles.recipeImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.floatingBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#051C60" />
        </TouchableOpacity>
        {recipe.isOwner && (
          <>
            <TouchableOpacity style={styles.floatingEditButton} onPress={() => navigation.navigate('CreateRecipe', { recipe })}>
              <Ionicons name="pencil-outline" size={22} color="#3B71F3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingDeleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={22} color="#e3342f" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={16} color="#3B71F3" />
          <Text style={styles.timeText}>Tiempo: {recipe.time}</Text>
        </View>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{recipe.description}</Text>

        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.boxContainer}>
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.bulletRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#3B71F3" />
              <Text style={styles.bulletText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Preparación paso a paso</Text>
        <View style={styles.boxContainer}>
          {recipe.steps && recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonWrapper}>
          <CustomButton text="Regresar" onPress={() => navigation.goBack()} type="SECONDARY" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { ...commonStyles.pageContainer },
  imageContainer: {
    position: 'relative',
    width: width,
    height: 250,
    backgroundColor: '#e1e1e1',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  floatingEditButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 25,
    right: 72,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  floatingDeleteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 25,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  floatingBackButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 25,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  contentContainer: { 
    padding: 20,
    backgroundColor: '#F9FBFC',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20, 
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#051C60', marginBottom: 10 },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7EAF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  timeText: { color: '#3B71F3', fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#051C60', marginTop: 20, marginBottom: 10 },
  description: { fontSize: 15, color: '#666', lineHeight: 22 },
  boxContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  bulletText: { marginLeft: 10, fontSize: 15, color: '#444' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  stepNumberContainer: {
    backgroundColor: '#3B71F3',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  stepText: { flex: 1, fontSize: 15, color: '#444', lineHeight: 20 },
  buttonWrapper: { marginTop: 30, marginBottom: 40 }
});

export default RecipeDetailScreen;