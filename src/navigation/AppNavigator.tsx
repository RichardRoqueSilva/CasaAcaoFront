import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- 1. ADICIONE ESTE IMPORT ---
// Importamos a biblioteca de ícones que o Expo nos fornece.
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Nossos navegadores de pilha para cada aba
import ListasNavigator from './ListasNavigator';
import ProdutosNavigator from './ProdutosNavigator';
import CategoriasNavigator from './CategoriasNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Esconde o cabeçalho de todas as abas de uma vez
      }}
    >
      {/* --- 2. MODIFIQUE CADA Tab.Screen --- */}

      <Tab.Screen
        name="ListasTab"
        component={ListasNavigator}
        options={{
          title: 'Listas',
          // A propriedade tabBarIcon é uma função que retorna o componente do ícone
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProdutosTab"
        component={ProdutosNavigator}
        options={{
          // Vou usar o nome "Despesas" que aparece na sua imagem
          title: 'Despesas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant-closed" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CategoriasTab"
        component={CategoriasNavigator}
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tag-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;