import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- 1. IMPORTE NOSSO TEMA DE CORES ---
import { colors } from '../styles/theme';

// Nossos navegadores de pilha para cada aba
import ListasNavigator from './ListasNavigator';
import ProdutosNavigator from './ProdutosNavigator';
import CategoriasNavigator from './CategoriasNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      // --- 2. TRANSFORME screenOptions EM UMA FUNÇÃO ---
      // Isso nos dá acesso ao objeto 'route' para cada aba.
      screenOptions={({ route }) => ({
        headerShown: false,

        // --- 3. DEFINA A COR ATIVA DINAMICAMENTE ---
        // Aqui está a mágica: escolhemos a cor com base no nome da rota.
        tabBarActiveTintColor: (() => {
          if (route.name === 'ListasTab') {
            return colors.listasDark;
          }
          if (route.name === 'ProdutosTab') {
            return colors.despesasDark;
          }
          if (route.name === 'CategoriasTab') {
            return colors.categoriasDark;
          }
          return 'blue'; // Uma cor padrão como fallback
        })(),

        // (Opcional) Você também pode definir a cor inativa se quiser
        // tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="ListasTab"
        component={ListasNavigator}
        options={{
          title: 'Listas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProdutosTab"
        component={ProdutosNavigator}
        options={{
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