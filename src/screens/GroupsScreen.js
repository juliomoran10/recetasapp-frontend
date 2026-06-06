import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_GROUPS as initialGroups, MOCK_RECIPES } from '../data/mockData';
import CustomButton from '../components/CustomButton';
import CustomSearchSelect from '../components/CustomSearchSelect';
import Header from '../components/Header';
import IconButton from '../components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/common';

const GroupsScreen = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [groupName, setGroupName] = useState('');
  
  const navigation = useNavigation();

  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const openCreateModal = () => {
    setIsEditing(false);
    setGroupName('');
    setSelectedRecipes([]); 
    setModalVisible(true);
  };

  const openEditModal = (group) => {
    setIsEditing(true);
    setCurrentGroupId(group.id);
    setGroupName(group.name);
    
    if (group.recipeCount > 0) {
      setSelectedRecipes([MOCK_RECIPES[0]]); 
    } else {
      setSelectedRecipes([]);
    }
    setModalVisible(true);
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Campo vacío', 'El grupo necesita un nombre.');
      return;
    }

    if (isEditing) {
      setGroups(groups.map(g => 
        g.id === currentGroupId 
          ? { ...g, name: groupName.trim(), recipeCount: selectedRecipes.length } 
          : g
      ));
    } else {
      const newGroup = {
        id: String(groups.length + 1),
        name: groupName.trim(),
        recipeCount: selectedRecipes.length
      };
      setGroups([...groups, newGroup]);
    }

    setModalVisible(false);
  };

  const handleDeleteGroup = (id, name) => {
    Alert.alert(
      '¿Borrar Grupo?',
      `Si eliminas el grupo "${name}", también se borrarán permanentemente todas las recetas asociadas a él.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar todo', style: 'destructive', onPress: () => setGroups(groups.filter(g => g.id !== id)) }
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

  return (
    <View style={styles.container}>
      <Header title="Grupos" />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupCard}
        contentContainerStyle={styles.listContainer}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Editar Grupo' : 'Nuevo Grupo'}</Text>
            
            <Text style={styles.subLabel}>Nombre del Grupo</Text>
            <TextInput
              placeholder="Ej. Comida Mexicana"
              placeholderTextColor="#999"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.modalInput}
            />

            <CustomSearchSelect 
              label="Agregar Recetas al Grupo"
              placeholder="Escribe para buscar recetas (ej. Pasta)..."
              searchKey="title" 
              data={MOCK_RECIPES}
              selectedItems={selectedRecipes}
              onAddItem={(item) => setSelectedRecipes([...selectedRecipes, item])}
              onRemoveItem={(id) => setSelectedRecipes(selectedRecipes.filter(r => r.id !== id))}
            />

            <View style={styles.modalButtons}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <CustomButton text={isEditing ? "Guardar" : "Crear"} onPress={handleSaveGroup} />
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
  listContainer: { paddingHorizontal: 15, paddingTop: 12, paddingBottom: 80 },
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
    shadowRadius: 4,
  },
  cardInfo: { flex: 1 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  groupName: { fontSize: 18, fontWeight: 'bold', color: '#051C60' },
  groupCount: { fontSize: 13, color: 'gray' },
  actions: { flexDirection: 'row' },
  actionButton: { padding: 10, marginLeft: 5 },
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
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 340,
    padding: 20,
    borderRadius: 15,
    elevation: 10,
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