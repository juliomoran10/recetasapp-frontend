import React from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AuthForm from '../components/AuthForm';
import { commonStyles } from '../styles/common';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  const handleSendEmail = ({ email }) => {
    const trimmedEmail = email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      Alert.alert('Campo obligatorio', 'Por favor, escribe tu email.');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Email inválido', 'Escribe un email válido para continuar.');
      return;
    }

    navigation.navigate('NewPassword');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>Ingresa tu correo para recibir las instrucciones de recuperación.</Text>

      <AuthForm
        fields={[{ name: 'email', placeholder: 'Correo electrónico' }]}
        onSubmit={handleSendEmail}
        submitText="Enviar"
        secondaryAction={{ text: 'Volver a iniciar sesión', onPress: () => navigation.navigate('SignIn'), type: 'TERTIARY', fgColor: '#3B71F3' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { ...commonStyles.pageContainer },
  content: { alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#051C60', marginVertical: 15, alignSelf: 'flex-start' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 18, alignSelf: 'flex-start' },
});

export default ForgotPasswordScreen;