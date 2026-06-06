import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MOCK_RECIPES, MOCK_GROUPS } from '../data/mockData';
import CustomButton from '../components/CustomButton';
import ImageSelector from '../components/ImageSelector';
import Header from '../components/Header';
import ActionRow from '../components/ActionRow';
import StatBox from '../components/StatBox';
import { commonStyles, COLORS } from '../styles/common';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: 'Chef Ejecutivo',
    email: 'chef.usuario@correo.com',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=200&auto=format&fit=crop'
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inputName, setInputName] = useState(user.name);
  const [inputAvatar, setInputAvatar] = useState(user.avatar);

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          } 
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠ Eliminar Cuenta',
      '¿Estás seguro de que deseas eliminar tu cuenta? Ya no podrás iniciar sesión ni gestionar tu perfil.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar cuenta', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Cuenta eliminada', 'Tu perfil ha sido dado de baja con éxito.');
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          } 
        }
      ]
    );
  };

  const openEditModal = () => {
    setInputName(user.name);
    setInputAvatar(user.avatar);
    setEditModalVisible(true);
  };

  const handleSaveChanges = () => {
    if (!inputName.trim()) {
      Alert.alert('Campo vacío', 'El nombre de perfil no puede estar vacío.');
      return;
    }
    setUser({
      ...user,
      name: inputName.trim(),
      avatar: inputAvatar
    });
    setEditModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Header title="Perfil" />
      
      <View style={styles.profileCard}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatar} 
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Tu actividad</Text>
      <View style={styles.statsContainer}>
        <StatBox icon="restaurant" color="#3B71F3" number={MOCK_RECIPES.length} label="Mis Recetas" />
        <View style={styles.verticalDivider} />
        <StatBox icon="folder" color="#4765A9" number={MOCK_GROUPS.length} label="Grupos" />
      </View>

      <Text style={styles.sectionTitle}>Ajustes de cuenta</Text>
      <View style={styles.optionsBox}>
        <ActionRow icon="person-outline" text="Editar mis datos" onPress={openEditModal} />

        <View style={styles.horizontalDivider} />

        <ActionRow icon="trash-outline" text="Eliminar mi cuenta" onPress={handleDeleteAccount} tint="#e3342f" />
      </View>

      <View style={styles.buttonWrapper}>
        <CustomButton text="Cerrar Sesión" onPress={handleSignOut} type="SECONDARY" />
      </View>

      <Modal animationType="slide" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            
            <Text style={styles.subLabel}>Foto de Perfil</Text>
            <ImageSelector 
              imageUri={inputAvatar} 
              onImageSelected={setInputAvatar} 
              placeholderText="Subir Foto"
            />

            <Text style={styles.subLabel}>Nombre Completo</Text>
            <TextInput
              placeholder="Tu nombre"
              placeholderTextColor="#999"
              value={inputName}
              onChangeText={setInputName}
              style={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <CustomButton text="Guardar" onPress={handleSaveChanges} />
              </View>
              <View style={{ flex: 1 }}>
                <CustomButton text="Cancelar" onPress={() => setEditModalVisible(false)} type="TERTIARY" fgColor="gray" />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { ...commonStyles.pageContainer },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 25,
    marginTop: 10
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 15, backgroundColor: '#ccc' },
  userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: 'gray' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#051C60', marginBottom: 12, marginLeft: 5 },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 15,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#051C60', marginTop: 5 },
  statLabel: { fontSize: 12, color: 'gray', marginTop: 2 },
  verticalDivider: { width: 1, height: '70%', backgroundColor: '#e8e8e8' },
  optionsBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionText: { fontSize: 15, color: '#333', marginLeft: 12, fontWeight: '500' },
  horizontalDivider: { height: 1, backgroundColor: '#F0F0F0' },
  buttonWrapper: { marginTop: 10, marginBottom: 20 },
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

export default ProfileScreen;