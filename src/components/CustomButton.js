import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';

const CustomButton = ({ onPress, text, type = 'PRIMARY', bgColor, fgColor }) => {
  const isPrimary = type === 'PRIMARY';
  const isTertiary = type === 'TERTIARY';

  let backgroundColor = '#FF7A00'; 
  if (isTertiary) {
    backgroundColor = 'transparent'; 
  }
  if (bgColor) {
    backgroundColor = bgColor; 
  }

  let textColor = 'white'; 
  if (isTertiary) {
    textColor = 'gray'; 
  }
  if (fgColor) {
    textColor = fgColor; 
  }

  return (
    <Pressable 
      onPress={onPress} 
      style={[
        styles.container, 
        { backgroundColor: backgroundColor },
        isPrimary ? styles.container_PRIMARY_Shadow : {}
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  container_PRIMARY_Shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomButton;