import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { commonStyles, COLORS } from '../styles/common';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const onLogOutPressed = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>¡Bienvenido a Creativa!</Text>
      <Text style={styles.subtitle}>Has iniciado sesión correctamente.</Text>
      
      <View style={styles.buttonContainer}>
        <CustomButton 
          text="Cerrar Sesión" 
          onPress={onLogOutPressed} 
          bgColor="#E7EAF4"
          fgColor="#4765A9"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.pageContainer,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#051C60',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 200,
  }
});

export default HomeScreen;