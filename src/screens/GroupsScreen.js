import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import CustomSearchSelect from '../components/CustomSearchSelect';
import Header from '../components/Header';
import IconButton from '../components/IconButton';
import { commonStyles } from '../styles/common';
import { listGroupsApi, getGroupApi, createGroupApi, updateGroupApi, deleteGroupApi } from '../services/groupsApi';
import { listRecipesApi } from '../services/recipesApi';
import { getAuthErrorMessage } from '../services/authMessages';
import { GROUP_RULES } from '../utils/validation';

const GroupsScreen = () => {
  const [groups, setGroups] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const navigation = useNavigation();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [groupsResult, recipesResult] = await Promise.all([
        listGroupsApi(),
        listRecipesApi()
      ]);
      setGroups(groupsResult.groups || []);
      setRecipes(recipesResult.recipes || []);
    } catch (error) {
      Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentGroupId(null);
    setGroupName('');
    setSelectedRecipes([]);
    setModalVisible(true);
  };

  const openEditModal = async (group) => {
    try {
      setIsEditing(true);
      setCurrentGroupId(group.id);
      setGroupName(group.name);
      setModalVisible(true);
      setSelectedRecipes([]);

      const [groupResult, recipesResult] = await Promise.all([
        getGroupApi(group.id),
        listRecipesApi()
      ]);
      const allRecipes = recipesResult.recipes || [];
      const recipeIds = groupResult.group?.recipeIds || [];

      setRecipes(allRecipes);
      setSelectedRecipes(allRecipes.filter((recipe) => recipeIds.includes(recipe.id)));
    } catch (error) {
      Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
      setModalVisible(false);
    }
  };

  const handleSaveGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Campo vacío', 'El grupo necesita un nombre.');
      return;
    }

    if (groupName.trim().length > GROUP_RULES.nameMax) {
      Alert.alert('Nombre muy largo', `El nombre del grupo no puede exceder ${GROUP_RULES.nameMax} caracteres.`);
      return;
    }

    const payload = {
      name: groupName.trim(),
      recipeIds: selectedRecipes.map((recipe) => recipe.id)
    };

    try {
      setSaving(true);

      if (isEditing) {
        await updateGroupApi(currentGroupId, payload);
      } else {
        await createGroupApi(payload);
      }

      setModalVisible(false);
      await loadData();
    } catch (error) {
      Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = (id, name) => {
    Alert.alert(
      '¿Borrar Grupo?',
      `Si eliminas el grupo "${name}", también se borrarán permanentemente todas las recetas asociadas a él.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar todo',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroupApi(id);
              await loadData();
            } catch (error) {
              Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
            }
          }
        }
      ]
    );
  };

  const renderGroupCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardInfo}
        onPress={() => navigation.navigate('GroupRecipesDetail', {
          groupName: item.name,
          groupId: item.id
        })}
      >
        <View style={styles.titleContainer}>
          <Ionicons name="folder-open" size={20} color="#3B71F3" style={{ marginRight: 8 }} />
          <Text style={styles.groupName}>{item.name}</Text>
        </View>
        <Text style={styles.groupCount}>{item.recipeCount} recetas asociadas</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <IconButton name="pencil" onPress={() => openEditModal(item)} />
        <IconButton name="trash" color="#e3342f" onPress={() => handleDeleteGroup(item.id, item.name)} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3B71F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Grupos" />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes grupos todavía. Crea uno con el botón +</Text>
        }
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Editar Grupo' : 'Nuevo Grupo'}</Text>

            <Text style={styles.subLabel}>Nombre del Grupo ({GROUP_RULES.nameMax} carac.)</Text>
            <TextInput
              placeholder="Ej. Comida Mexicana"
              placeholderTextColor="#999"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.modalInput}
              maxLength={GROUP_RULES.nameMax}
            />

            <CustomSearchSelect
              label="Agregar Recetas al Grupo"
              placeholder="Escribe para buscar recetas (ej. Pasta)..."
              searchKey="title"
              data={recipes}
              selectedItems={selectedRecipes}
              onAddItem={(item) => setSelectedRecipes([...selectedRecipes, item])}
              onRemoveItem={(id) => setSelectedRecipes(selectedRecipes.filter((recipe) => recipe.id !== id))}
            />

            <View style={styles.modalButtons}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <CustomButton text={saving ? 'Guardando...' : (isEditing ? 'Guardar' : 'Crear')} onPress={handleSaveGroup} />
              </View>
              <View style={{ flex: 1 }}>
                <CustomButton text="Cancelar" onPress={() => setModalVisible(false)} type="TERTIARY" fgColor="gray" />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...commonStyles.pageContainer },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: { paddingHorizontal: 15, paddingTop: 12, paddingBottom: 80 },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 40,
    fontSize: 15,
    fontStyle: 'italic'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cardInfo: { flex: 1 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  groupName: { fontSize: 18, fontWeight: 'bold', color: '#051C60' },
  groupCount: { fontSize: 13, color: 'gray' },
  actions: { flexDirection: 'row' },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#3B71F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 340,
    padding: 20,
    borderRadius: 15,
    elevation: 10
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#051C60',
    marginBottom: 15,
    textAlign: 'center'
  },
  subLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
    marginTop: 10
  },
  modalInput: {
    width: '100%',
    height: 48,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#333',
    backgroundColor: '#FAFAFA'
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20
  }
});

export default GroupsScreen;
