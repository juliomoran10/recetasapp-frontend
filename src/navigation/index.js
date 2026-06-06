import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import TabNavigator from './TabNavigator';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import AllRecipesScreen from '../screens/AllRecipesScreen';
import { meApi } from '../services/authApi';
import { clearToken, getToken } from '../services/sessionStorage';
import { linking } from './linking';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [initialRoute, setInitialRoute] = useState('SignIn');

  useEffect(() => {
    let mounted = true;

    async function bootstrapSession() {
      try {
        const token = await getToken();
        if (token) {
          await meApi();
          if (mounted) {
            setInitialRoute('Home');
          }
        }
      } catch {
        await clearToken();
        if (mounted) {
          setInitialRoute('SignIn');
        }
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (bootstrapping) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3B71F3" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

        <Stack.Screen name="Home" component={TabNavigator} />

        <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />

        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />

        <Stack.Screen name="GroupRecipesDetail" component={AllRecipesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FBFC'
  }
});

export default Navigation;
