import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomSearchSelect from '../components/CustomSearchSelect';
import ImageSelector from '../components/ImageSelector';
import { commonStyles } from '../styles/common';
import { createRecipeApi, updateRecipeApi } from '../services/recipesApi';
import { listGroupsApi } from '../services/groupsApi';
import { getAuthErrorMessage } from '../services/authMessages';

const CreateRecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingRecipe = route.params?.recipe;

  const [title, setTitle] = useState(editingRecipe?.title || '');
  const [description, setDescription] = useState(editingRecipe?.description || '');
  const [time, setTime] = useState(editingRecipe?.time || '');
  const [ingredients, setIngredients] = useState(editingRecipe?.ingredients?.join(', ') || '');
  const [steps, setSteps] = useState(editingRecipe?.steps?.join('\n') || '');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [recipeImage, setRecipeImage] = useState(editingRecipe?.image || editingRecipe?.recipeImage || null);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadGroups = useCallback(async () => {
    try {
      setLoadingGroups(true);
      const result = await listGroupsApi();
      const allGroups = result.groups || [];
      setGroups(allGroups);

      if (editingRecipe?.groupIds?.length) {
        setSelectedGroups(allGroups.filter((g) => editingRecipe.groupIds.includes(g.id)));
      }
    } catch (error) {
      Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [loadGroups])
  );

  const onSavePressed = async () => {
    if (!title.trim() || !ingredients.trim() || !steps.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa al menos el título, ingredientes y los pasos.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        time: time.trim(),
        ingredients,
        steps,
        groupIds: selectedGroups.map((group) => group.id),
        image: recipeImage
      };

      if (editingRecipe) {
        await updateRecipeApi(editingRecipe.id, payload);
        Alert.alert('¡Éxito!', 'Receta actualizada correctamente.');
      } else {
        await createRecipeApi(payload);
        Alert.alert('¡Éxito!', 'Receta guardada con éxito.');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error al guardar', getAuthErrorMessage(error.payload?.error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{editingRecipe ? 'Editar Receta' : 'Crear Nueva Receta'}</Text>

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

        {loadingGroups ? (
          <ActivityIndicator color="#3B71F3" style={{ marginTop: 20 }} />
        ) : (
          <CustomSearchSelect
            label="Asociar a Grupos"
            placeholder="Escribe para buscar un grupo..."
            data={groups}
            selectedItems={selectedGroups}
            onAddItem={(item) => setSelectedGroups([...selectedGroups, item])}
            onRemoveItem={(id) => setSelectedGroups(selectedGroups.filter((group) => group.id !== id))}
          />
        )}

        <View style={styles.buttonContainer}>
          <CustomButton text={saving ? 'Guardando...' : 'Guardar Receta'} onPress={onSavePressed} />
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
