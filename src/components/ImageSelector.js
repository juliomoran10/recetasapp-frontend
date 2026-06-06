import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ImageSelector = ({ imageUri, onImageSelected, placeholderText = "Seleccionar Imagen" }) => {

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos para cambiar la imagen.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const takeWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para tomar fotos.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const showPickerOptions = () => {
    Alert.alert(
      'Seleccionar Imagen',
      '¿Desde dónde quieres subir la foto?',
      [
        { text: 'Galería', onPress: pickFromGallery },
        { text: 'Cámara', onPress: takeWithCamera },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickerBox} onPress={showPickerOptions}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="camera-outline" size={32} color="#3B71F3" />
            <Text style={styles.placeholderText}>{placeholderText}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 10 },
  pickerBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  placeholderContainer: { alignItems: 'center' },
  placeholderText: { fontSize: 12, color: '#999', marginTop: 5, textAlign: 'center', paddingHorizontal: 5 }
});

export default ImageSelector;