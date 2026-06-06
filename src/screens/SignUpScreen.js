import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AuthForm from '../components/AuthForm';
import { useNavigation } from '@react-navigation/native';
import { isValidPassword, passwordValidationMessage } from '../utils/validation';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const navigation = useNavigation();

  const onRegisterPressed = ({ username: u, email: e, password: p, passwordRepeat: pr }) => {
    if (!u.trim() || !e.trim() || !p.trim() || !pr.trim()) {
      Alert.alert('Campos incompletos', 'Por favor, rellena todos los campos del formulario.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e.trim())) {
      Alert.alert('Correo electrónico inválido', 'Por favor, introduce un correo electrónico real (ejemplo@dominio.com).');
      return;
    }

    if (!isValidPassword(p)) {
      Alert.alert('Contraseña inválida', passwordValidationMessage);
      return;
    }

    if (p !== pr) {
      Alert.alert('Error de coincidencia', 'Las contraseñas ingresadas no coinciden.');
      return;
    }

    navigation.navigate('ConfirmEmail');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Crear cuenta</Text>

      <AuthForm
        fields={[
          { name: 'username', placeholder: 'Usuario' },
          { name: 'email', placeholder: 'Correo electrónico' },
          { name: 'password', placeholder: 'Contraseña', secure: true },
          { name: 'passwordRepeat', placeholder: 'Repetir contraseña', secure: true }
        ]}
        onSubmit={onRegisterPressed}
        submitText="Registrarme"
        secondaryAction={{ text: '¿Ya tienes cuenta? Inicia sesión', onPress: () => navigation.navigate('SignIn'), type: 'TERTIARY', fgColor: '#3B71F3' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F9FBFC' }, content: { alignItems: 'center', padding: 20, paddingTop: 50 }, title: { fontSize: 28, fontWeight: 'bold', color: '#051C60', marginVertical: 15, alignSelf: 'flex-start' } });
export default SignUpScreen;