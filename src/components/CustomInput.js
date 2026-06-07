import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, maxLength, multiline, keyboardType, containerStyle }) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry={isSecure}
        maxLength={maxLength}
        multiline={multiline}
        keyboardType={keyboardType}
      />
      
      {secureTextEntry && (
        <Pressable 
          onPress={() => setIsSecure(!isSecure)} 
          style={styles.eyeButton}
        >
          <Ionicons 
            name={isSecure ? "eye-off-outline" : "eye-outline"} 
            size={22} 
            color="#0d0505" 
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  eyeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomInput;