// src/navigation/CategoriasNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import { colors } from '../styles/theme'; // <<< IMPORTE O TEMA

import CategoriasScreen from '../screens/CategoriasScreen';
import CategoriaFormScreen from '../screens/CategoriasFormScreen';

export type CategoriasStackParamList = {
  CategoriasList: undefined;
  CategoriaForm: { categoriaId?: number };
};

const Stack = createNativeStackNavigator<CategoriasStackParamList>();

const CategoriasNavigator = () => {
  return (
    // <<< APLIQUE AS OPÇÕES DE ESTILO AQUI
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.categoriasDark,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="CategoriasList" component={CategoriasScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CategoriaForm"
        component={CategoriaFormScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          title: 'Nova Categoria',
          headerLeft: () => <Button onPress={() => navigation.goBack()} textColor={colors.white}>Cancelar</Button>,
        })}
      />
    </Stack.Navigator>
  );
};

export default CategoriasNavigator;