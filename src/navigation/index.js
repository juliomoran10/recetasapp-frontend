import React from 'react';
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

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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

export default Navigation;