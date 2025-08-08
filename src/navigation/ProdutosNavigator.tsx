// src/navigation/ProdutosNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import { colors } from '../styles/theme'; // <<< IMPORTE O TEMA

import ProdutosScreen from '../screens/ProdutosScreen';
import ProdutoFormScreen from '../screens/ProdutosFormScreen';

export type ProdutosStackParamList = {
  ProdutosList: undefined;
  ProdutoForm: { produtoId?: number };
};

const Stack = createNativeStackNavigator<ProdutosStackParamList>();

const ProdutosNavigator = () => {
  return (
    // <<< APLIQUE AS OPÇÕES DE ESTILO AQUI
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.despesasDark,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="ProdutosList" component={ProdutosScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ProdutoForm"
        component={ProdutoFormScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          title: 'Novo Produto',
          headerLeft: () => <Button onPress={() => navigation.goBack()} textColor={colors.white}>Cancelar</Button>,
        })}
      />
    </Stack.Navigator>
  );
};

export default ProdutosNavigator;