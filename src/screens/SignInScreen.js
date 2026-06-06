import React, { useState } from 'react';
import { Text, Image, StyleSheet, useWindowDimensions, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AuthForm from '../components/AuthForm';
import { commonStyles, COLORS } from '../styles/common';
import { useNavigation } from '@react-navigation/native';
import LogoImg from '../../assets/logo.png'; 
import { isValidPassword, passwordValidationMessage } from '../utils/validation';
import { loginAndSaveSession } from '../services/authApi';
import { getAuthErrorMessage } from '../services/authMessages';

const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const handleSignInWithValues = async ({ username: u, password: p }) => {
    if (!u?.trim() || !p?.trim()) {
      Alert.alert('Campos obligatorios', 'Por favor, rellena todos los campos para ingresar.');
      return;
    }

    if (!isValidPassword(p)) {
      Alert.alert('Contraseña inválida', passwordValidationMessage);
      return;
    }

    try {
      await loginAndSaveSession({ username: u.trim(), password: p });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (error) {
      Alert.alert('Inicio de sesión fallido', getAuthErrorMessage(error.payload?.error));
    }
  };

  return (
    <ScrollView style={[styles.container]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Image source={LogoImg} style={[styles.logo, { height: height * 0.25 }]} resizeMode="contain" />
      <Text style={styles.title}>¿Qué Cocino Hoy?</Text>

      <AuthForm
        fields={[
          { name: 'username', placeholder: 'Usuario' },
          { name: 'password', placeholder: 'Contraseña', secure: true }
        ]}
        initialValues={{ username, password }}
        onSubmit={(vals) => handleSignInWithValues(vals)}
        submitText="Iniciar sesión"
        secondaryAction={{ text: 'Olvidé mi contraseña', onPress: () => navigation.navigate('ForgotPassword') }}
      />

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpLink}>
        <Text style={styles.signUpText}>¿No tienes cuenta? Crea una</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({ 
  container: { 
    ...commonStyles.pageContainer
  }, 
  content: { 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 50 
  }, 
  logo: { 
    width: '70%', 
    maxWidth: 250 
  }, 
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: COLORS.text, 
    marginVertical: 15 
  },
  signUpLink: {
    marginTop: 14,
  },
  signUpText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  }
});

export default SignInScreen;