import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

import AllRecipesScreen from '../screens/AllRecipesScreen';
import MyRecipesScreen from '../screens/MyRecipesScreen';
import GroupsScreen from '../screens/GroupsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#051C60',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e8e8e8',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'AllRecipes') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'MyRecipes') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Groups') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B71F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5, 
          height: 60 + insets.bottom, 
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e8e8e8',
        },
      })}
    >
      <Tab.Screen name="AllRecipes" component={AllRecipesScreen} options={{ title: 'Explorar' }} />
      <Tab.Screen name="MyRecipes" component={MyRecipesScreen} options={{ title: 'Mis Recetas' }} />
      <Tab.Screen name="Groups" component={GroupsScreen} options={{ title: 'Grupos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;