import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomSearchSelect from '../components/CustomSearchSelect';
import ImageSelector from '../components/ImageSelector';
import { commonStyles } from '../styles/common';
import { createRecipeApi, updateRecipeApi } from '../services/recipesApi';
import { listGroupsApi } from '../services/groupsApi';
import { getAuthErrorMessage } from '../services/authMessages';
import { RECIPE_RULES } from '../utils/validation';

const CreateRecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingRecipe = route.params?.recipe;

  const [title, setTitle] = useState(editingRecipe?.title || '');
  const [description, setDescription] = useState(editingRecipe?.description || '');
  const [timeValue, setTimeValue] = useState(() => {
    const t = editingRecipe?.time || '';
    const parts = t.match(/^(\d+)\s*(min|h)$/);
    return parts ? parts[1] : '';
  });
  const [timeUnit, setTimeUnit] = useState(() => {
    const t = editingRecipe?.time || '';
    const parts = t.match(/^(\d+)\s*(min|h)$/);
    return parts ? parts[2] : 'min';
  });
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

    const num = parseInt(timeValue, 10);
    if (!timeValue.trim() || isNaN(num) || num < 1) {
      Alert.alert('Tiempo inválido', 'Ingresa un número positivo.');
      return;
    }
    if (timeUnit === 'min' && num > 59) {
      Alert.alert('Tiempo inválido', 'Los minutos deben ser entre 1 y 59.');
      return;
    }
    if (timeUnit === 'h' && num > 24) {
      Alert.alert('Tiempo inválido', 'Las horas deben ser entre 1 y 24.');
      return;
    }

    if (title.trim().length > RECIPE_RULES.titleMax) {
      Alert.alert('Título muy largo', `El título no puede exceder ${RECIPE_RULES.titleMax} caracteres.`);
      return;
    }

    if (description.trim().length > RECIPE_RULES.descriptionMax) {
      Alert.alert('Descripción muy larga', `La descripción no puede exceder ${RECIPE_RULES.descriptionMax} caracteres.`);
      return;
    }

    const ingredientList = ingredients.split(',').map(i => i.trim()).filter(Boolean);
    const longIngredient = ingredientList.find(i => i.length > RECIPE_RULES.ingredientMax);
    if (longIngredient) {
      Alert.alert('Ingrediente muy largo', `Cada ingrediente debe tener máximo ${RECIPE_RULES.ingredientMax} caracteres.`);
      return;
    }

    const stepList = steps.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const longStep = stepList.find(s => s.length > RECIPE_RULES.stepMax);
    if (longStep) {
      Alert.alert('Paso muy largo', `Cada paso debe tener máximo ${RECIPE_RULES.stepMax} caracteres.`);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        time: `${parseInt(timeValue, 10)} ${timeUnit}`,
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
        <CustomInput placeholder="Ej. Arepas de Queso" value={title} setValue={setTitle} maxLength={RECIPE_RULES.titleMax} />

        <Text style={styles.label}>Descripción Breve</Text>
        <CustomInput placeholder="Ej. Deliciosas arepas rellenas..." value={description} setValue={setDescription} maxLength={RECIPE_RULES.descriptionMax} />

        <Text style={styles.label}>Tiempo de Preparación</Text>
        <View style={styles.timeRow}>
          <CustomInput
            placeholder="30"
            value={timeValue}
            setValue={setTimeValue}
            keyboardType="numeric"
            maxLength={2}
            containerStyle={{ flex: 1, marginRight: 8 }}
          />
          <TouchableOpacity
            style={[styles.unitBtn, timeUnit === 'min' && styles.unitBtnActive]}
            onPress={() => setTimeUnit('min')}
          >
            <Text style={[styles.unitBtnText, timeUnit === 'min' && styles.unitBtnTextActive]}>min</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitBtn, timeUnit === 'h' && styles.unitBtnActive]}
            onPress={() => setTimeUnit('h')}
          >
            <Text style={[styles.unitBtnText, timeUnit === 'h' && styles.unitBtnTextActive]}>h</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Ingredientes (separados por coma)</Text>
        <CustomInput placeholder="Ej. Harina, Sal, Agua, Queso" value={ingredients} setValue={setIngredients} />

        <Text style={styles.label}>Pasos a seguir</Text>
        <CustomInput placeholder="Describe cómo prepararlo..." value={steps} setValue={setSteps} multiline />

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
  buttonContainer: { marginTop: 25, marginBottom: 30 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  unitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    backgroundColor: 'white',
    marginLeft: 6
  },
  unitBtnActive: { backgroundColor: '#3B71F3', borderColor: '#3B71F3' },
  unitBtnText: { fontSize: 14, color: '#333' },
  unitBtnTextActive: { color: 'white', fontWeight: 'bold' }
});

export default CreateRecipeScreen;
