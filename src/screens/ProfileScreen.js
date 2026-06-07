import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import ImageSelector from '../components/ImageSelector';
import Header from '../components/Header';
import ActionRow from '../components/ActionRow';
import StatBox from '../components/StatBox';
import { commonStyles, COLORS } from '../styles/common';
import { getProfileApi, updateProfileApi, deleteAccountApi } from '../services/profileApi';
import { logoutApi } from '../services/authApi';
import { clearToken } from '../services/sessionStorage';
import { getAuthErrorMessage } from '../services/authMessages';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    avatar: null
  });
  const [stats, setStats] = useState({ recipeCount: 0, groupCount: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inputName, setInputName] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [inputAvatar, setInputAvatar] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProfileApi();
      const profile = result.profile;

      setUser({
        name: profile.name,
        username: profile.username,
        email: profile.email,
        avatar: profile.avatar
      });
      setStats(profile.stats || { recipeCount: 0, groupCount: 0 });
    } catch (error) {
      Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutApi();
            } catch {
              // clearToken already runs in logoutApi finally block
            }

            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }]
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
          onPress: async () => {
            try {
              await deleteAccountApi();
              await clearToken();
              Alert.alert('Cuenta eliminada', 'Tu perfil ha sido dado de baja con éxito.');
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }]
              });
            } catch (error) {
              Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
            }
          }
        }
      ]
    );
  };

  const openEditModal = () => {
    setInputName(user.name);
    setInputUsername(user.username);
    setInputAvatar(user.avatar);
    setEditModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!inputName.trim()) {
      Alert.alert('Campo vacío', 'El nombre de perfil no puede estar vacío.');
      return;
    }

    if (!inputUsername.trim()) {
      Alert.alert('Campo vacío', 'El nombre de usuario no puede estar vacío.');
      return;
    }

    try {
      setSaving(true);
      const result = await updateProfileApi({
        name: inputName.trim(),
        username: inputUsername.trim(),
        avatar: inputAvatar
      });

      const profile = result.profile;
      setUser({
        name: profile.name,
        username: profile.username,
        email: profile.email,
        avatar: profile.avatar
      });
      setStats(profile.stats || stats);
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', getAuthErrorMessage(error.payload?.error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3B71F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Header title="Perfil" />

      <View style={styles.profileCard}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{user.name?.charAt(0)?.toUpperCase() || '?'}</Text>
          </View>
        )}
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userUsername}>@{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Tu actividad</Text>
      <View style={styles.statsContainer}>
        <StatBox icon="restaurant" color="#3B71F3" number={stats.recipeCount} label="Mis Recetas" />
        <View style={styles.verticalDivider} />
        <StatBox icon="folder" color="#4765A9" number={stats.groupCount} label="Grupos" />
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

            <Text style={styles.subLabel}>Nombre de Usuario</Text>
            <TextInput
              placeholder="Tu usuario"
              placeholderTextColor="#999"
              value={inputUsername}
              onChangeText={setInputUsername}
              style={styles.modalInput}
              autoCapitalize="none"
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
                <CustomButton text={saving ? 'Guardando...' : 'Guardar'} onPress={handleSaveChanges} />
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E7EAF4'
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4765A9'
  },
  userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  userUsername: { fontSize: 14, color: '#3B71F3', marginBottom: 2 },
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
    marginBottom: 25
  },
  verticalDivider: { width: 1, height: '70%', backgroundColor: '#e8e8e8' },
  optionsBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 30
  },
  horizontalDivider: { height: 1, backgroundColor: '#F0F0F0' },
  buttonWrapper: { marginTop: 10, marginBottom: 20 },
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

export default ProfileScreen;
