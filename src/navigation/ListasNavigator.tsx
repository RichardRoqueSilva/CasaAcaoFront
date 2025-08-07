// src/navigation/ListasNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListasScreen from '../screens/ListasScreen';
import ListaFormScreen from '../screens/ListasFormScreen';
import ListaDetailScreen from '../screens/ListasDetailScreen';
import ItemFormScreen from '../screens/ItemFormScreen';
import { Button } from 'react-native-paper';

export type ListasStackParamList = {
  ListasList: undefined;
  ListaForm: { listaId?: number };
  ListaDetail: { listaId: number; listaNome: string };
  // AQUI ESTÁ A CORREÇÃO: Adicionamos o produtoId como opcional
  ItemForm: { listaId: number; produtoId?: number }; 
};

const Stack = createNativeStackNavigator<ListasStackParamList>();

const ListasNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListasList" component={ListasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ListaDetail" component={ListaDetailScreen} />
      
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="ListaForm"
          component={ListaFormScreen}
          options={({ navigation }) => ({
            title: 'Nova Lista',
            headerLeft: () => <Button onPress={() => navigation.goBack()}>Cancelar</Button>,
          })}
        />
        <Stack.Screen
          name="ItemForm"
          component={ItemFormScreen}
          options={({ navigation }) => ({
            title: 'Adicionar Item',
            headerLeft: () => <Button onPress={() => navigation.goBack()}>Cancelar</Button>,
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ListasNavigator;