// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListasScreen from '../screens/ListasScreen';
import ProdutosScreen from '../screens/ProdutosScreen';
import CategoriasNavigator from './CategoriasNavigator'; // Importe o novo navegador
import ProdutosNavigator from './ProdutosNavigator';
import ListasNavigator from './ListasNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ListasTab"
        component={ListasNavigator} // Use a pilha aqui
        options={{ title: 'Listas', headerShown: false }}
      />
      <Tab.Screen
        name="ProdutosTab"
        component={ProdutosNavigator} // Use a pilha aqui
        options={{ title: 'Despesas', headerShown: false }}
      />
      <Tab.Screen
        name="CategoriasTab" // O nome da aba
        component={CategoriasNavigator} // Use a pilha aqui
        options={{ 
          title: 'Categorias', // O texto que aparece na aba
          headerShown: false    // Esconde o header padrão do TabNavigator
        }} 
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;