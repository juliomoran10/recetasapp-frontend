import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { COLORS } from '../styles/common';

const AuthForm = ({
  fields = [],
  initialValues = {},
  onSubmit,
  submitText = 'Submit',
  secondaryAction
}) => {
  const [values, setValues] = useState(() => {
    const init = {};
    fields.forEach(f => { init[f.name] = initialValues[f.name] ?? ''; });
    return init;
  });

  const setField = (name, val) => setValues(v => ({ ...v, [name]: val }));

  return (
    <View style={styles.container}>
      {fields.map(field => (
        <CustomInput
          key={field.name}
          placeholder={field.placeholder}
          value={values[field.name]}
          setValue={(val) => setField(field.name, val)}
          secureTextEntry={field.secure}
        />
      ))}

      <CustomButton text={submitText} onPress={() => onSubmit(values)} />

      {secondaryAction?.text && (
        <CustomButton
          text={secondaryAction.text}
          onPress={secondaryAction.onPress}
          type={secondaryAction.type || 'TERTIARY'}
          fgColor={secondaryAction.fgColor || COLORS.primary}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' }
});

export default AuthForm;
