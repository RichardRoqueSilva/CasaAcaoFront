// src/navigation/ProdutosNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProdutosScreen from '../screens/ProdutosScreen';
import ProdutoFormScreen from '../screens/ProdutosFormScreen';
import { Button } from 'react-native-paper';

export type ProdutosStackParamList = {
  ProdutosList: undefined;
  ProdutoForm: { produtoId?: number };
};

const Stack = createNativeStackNavigator<ProdutosStackParamList>();

const ProdutosNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProdutosList"
        component={ProdutosScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProdutoForm"
        component={ProdutoFormScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          title: 'Novo Produto',
          headerLeft: () => (
            <Button onPress={() => navigation.goBack()}>Cancelar</Button>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default ProdutosNavigator;