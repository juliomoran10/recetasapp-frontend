import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AuthForm from '../components/AuthForm';
import { commonStyles } from '../styles/common';
import { useNavigation } from '@react-navigation/native';
import { isValidPassword, passwordValidationMessage } from '../utils/validation';

const NewPasswordScreen = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigation = useNavigation();

  const onSubmitPressed = ({ code: c, newPassword: np }) => {
    if (!c.trim() || !np.trim()) {
      Alert.alert('Campos vacíos', 'Por favor, introduce el código de verificación y tu nueva contraseña.');
      return;
    }

    if (!isValidPassword(np)) {
      Alert.alert('Contraseña inválida', passwordValidationMessage);
      return;
    }

    Alert.alert('Éxito', 'Tu contraseña ha sido restablecida correctamente.');
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Restablecer contraseña</Text>

      <AuthForm
        fields={[{ name: 'code', placeholder: 'Código' }, { name: 'newPassword', placeholder: 'Nueva contraseña', secure: true }]}
        onSubmit={onSubmitPressed}
        submitText="Guardar"
        secondaryAction={{ text: 'Volver a iniciar sesión', onPress: () => navigation.navigate('SignIn'), type: 'TERTIARY', fgColor: '#3B71F3' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F9FBFC' }, content: { alignItems: 'center', padding: 20, paddingTop: 60 }, title: { fontSize: 28, fontWeight: 'bold', color: '#051C60', marginVertical: 15, alignSelf: 'flex-start' } });
export default NewPasswordScreen;