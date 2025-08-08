// src/navigation/ListasNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import { colors } from '../styles/theme'; // <<< IMPORTE O TEMA
import CustomHeader from '../components/CustomHeader';

import ListasScreen from '../screens/ListasScreen';
import ListaDetailScreen from '../screens/ListasDetailScreen';
import ListaFormScreen from '../screens/ListasFormScreen';
import ItemFormScreen from '../screens/ItemFormScreen';

export type ListasStackParamList = {
  ListasList: undefined;
  ListaDetail: { listaId: number; listaNome: string };
  ListaForm: { listaId?: number };
  ItemForm: { listaId: number; produtoId?: number };
};

const Stack = createNativeStackNavigator<ListasStackParamList>();

const ListasNavigator = () => {
  return (
    // <<< APLIQUE AS OPÇÕES DE ESTILO AQUI
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.listasDark, // Cor de fundo do cabeçalho
        },
        headerTintColor: colors.white, // Cor do título e dos botões (ex: seta de voltar)
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="ListasList" component={ListasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ListaDetail" component={ListaDetailScreen} />
      
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="ListaForm"
          component={ListaFormScreen}
           // --- AQUI ESTÁ A MUDANÇA ---
          options={{ headerShown: false }} // Desligamos o header padrão
        />
        <Stack.Screen
          name="ItemForm"
          component={ItemFormScreen}
          options={{ headerShown: false }} // Desligamos o header padrão
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ListasNavigator;