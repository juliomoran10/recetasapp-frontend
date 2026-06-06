import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomSearchSelect from '../components/CustomSearchSelect';
import ImageSelector from '../components/ImageSelector';
import { commonStyles } from '../styles/common';
import { useNavigation } from '@react-navigation/native';
import { MOCK_GROUPS } from '../data/mockData'; 

const CreateRecipeScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [recipeImage, setRecipeImage] = useState(null);

  const navigation = useNavigation();

  const onSavePressed = () => {
    if (!title.trim() || !ingredients.trim() || !steps.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa al menos el título, ingredientes y los pasos.');
      return;
    }

    const associatedGroupIds = selectedGroups.map(g => g.id);
    
    console.log("Datos de la receta listos para el backend:", {
      title, description, time, ingredients, steps, associatedGroupIds, recipeImage
    });

    Alert.alert('¡Éxito!', `Receta guardada con éxito ${recipeImage ? 'con imagen' : ''} y vinculada a ${associatedGroupIds.length} grupo(s).`);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Crear Nueva Receta</Text>

        <Text style={styles.labelCenter}>Foto del Platillo</Text>
        <ImageSelector 
          imageUri={recipeImage} 
          onImageSelected={setRecipeImage} 
          placeholderText="Subir foto del plato"
        />

        <Text style={styles.label}>Título de la Receta</Text>
        <CustomInput placeholder="Ej. Arepas de Queso" value={title} setValue={setTitle} />

        <Text style={styles.label}>Descripción breve</Text>
        <CustomInput placeholder="Ej. Deliciosas arepas rellenas..." value={description} setValue={setDescription} />

        <Text style={styles.label}>Tiempo de preparación</Text>
        <CustomInput placeholder="Ej. 30 min" value={time} setValue={setTime} />

        <Text style={styles.label}>Ingredientes (separados por coma)</Text>
        <CustomInput placeholder="Ej. Harina, Sal, Agua, Queso" value={ingredients} setValue={setIngredients} />

        <Text style={styles.label}>Pasos a seguir</Text>
        <CustomInput placeholder="Describe cómo prepararlo..." value={steps} setValue={setSteps} />

        <CustomSearchSelect 
          label="Asociar a Grupos"
          placeholder="Escribe para buscar un grupo..."
          data={MOCK_GROUPS}
          selectedItems={selectedGroups}
          onAddItem={(item) => setSelectedGroups([...selectedGroups, item])}
          onRemoveItem={(id) => setSelectedGroups(selectedGroups.filter(g => g.id !== id))}
        />

        <View style={styles.buttonContainer}>
          <CustomButton text="Guardar Receta" onPress={onSavePressed} />
          <CustomButton text="Cancelar" onPress={() => navigation.goBack()} type="TERTIARY" fgColor="gray" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBFC' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#051C60', marginBottom: 20, marginTop: 10 },
  label: { fontSize: 14, fontWeight: 'bold', color: 'gray', marginTop: 15, marginBottom: -5, marginLeft: 5 },
  labelCenter: { fontSize: 14, fontWeight: 'bold', color: 'gray', marginTop: 5, marginBottom: 5, textAlign: 'center' },
  buttonContainer: { marginTop: 25, marginBottom: 30 }
});

export default CreateRecipeScreen;