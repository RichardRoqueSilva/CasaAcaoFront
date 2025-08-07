// src/navigation/CategoriasNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriasScreen from '../screens/CategoriasScreen';
import CategoriaFormScreen from '../screens/CategoriasFormScreen';
import { Button } from 'react-native-paper'; // Importe o Button


// Este tipo mapeia o nome de cada rota para os parâmetros que ela aceita.
export type CategoriasStackParamList = {
  CategoriasList: undefined; // A tela de lista não recebe parâmetros.
  CategoriaForm: { categoriaId?: number }; // O formulário pode receber um categoriaId (opcional).
};
// ------------------------------------------

// Agora, informamos ao StackNavigator que ele usará a nossa definição de tipos.
const Stack = createNativeStackNavigator<CategoriasStackParamList>();

const CategoriasNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategoriasList"
        component={CategoriasScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoriaForm"
        component={CategoriaFormScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          title: 'Nova Categoria',
          headerLeft: () => (
            <Button onPress={() => navigation.goBack()}>Cancelar</Button>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default CategoriasNavigator;