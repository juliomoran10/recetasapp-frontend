import React from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AuthForm from '../components/AuthForm';
import { commonStyles } from '../styles/common';
import { useNavigation } from '@react-navigation/native';
import { confirmEmailApi } from '../services/authApi';
import { getAuthErrorMessage } from '../services/authMessages';

const ConfirmEmailScreen = () => {
  const navigation = useNavigation();

  const handleConfirm = async ({ code }) => {
    try {
      await confirmEmailApi({ code: code?.trim() });
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Confirmación fallida', getAuthErrorMessage(error.payload?.error));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Confirma tu correo</Text>

      <AuthForm
        fields={[{ name: 'code', placeholder: 'Código de confirmación' }]}
        onSubmit={handleConfirm}
        submitText="Confirmar"
        secondaryAction={{ text: 'Reenviar código', onPress: () => console.warn('Código reenviado'), type: 'TERTIARY', fgColor: '#555' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { ...commonStyles.pageContainer },
  content: { alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#051C60', marginVertical: 15, alignSelf: 'flex-start' },
});

export default ConfirmEmailScreen;