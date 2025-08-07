import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Button, List, IconButton, Text, Divider, Snackbar, Portal } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { ListasStackParamList } from '../navigation/ListasNavigator';
import { removeItemDaLista } from '../redux/slices/listasSlice';
import { ItemListaResponseDTO } from '../types';

type ListaDetailScreenNavigationProp = NativeStackNavigationProp<ListasStackParamList, 'ListaDetail'>;
type ListaDetailScreenRouteProp = RouteProp<ListasStackParamList, 'ListaDetail'>;

const ListaDetailScreen = () => {
  const navigation = useNavigation<ListaDetailScreenNavigationProp>();
  const route = useRoute<ListaDetailScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { listaId, listaNome } = route.params;
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const lista = useSelector((state: RootState) => 
    state.listas.listas.find(l => l.id === listaId)
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: listaNome });
  }, [navigation, listaNome]);

  const handleRemoveItem = async (produtoId: number) => {
    try {
      await dispatch(removeItemDaLista({ listaId, produtoId })).unwrap();
    } catch (error: any) {
      console.error('Falha ao remover item:', error);
      setSnackbarMessage(typeof error === 'string' ? error : 'Falha ao remover item');
      setSnackbarVisible(true);
    }
  };
  
  const handleEditItem = (produtoId: number) => {
    navigation.navigate('ItemForm', { listaId, produtoId });
  };

  const totalGasto = lista?.itens.reduce((acc, item) => {
    const preco = item.precoUnitario || 0;
    return acc + (preco * item.quantidade);
  }, 0) || 0;

  if (!lista) {
    return (
      <View style={styles.centered}>
        <Text>Lista não encontrada. Volte e tente novamente.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ItemListaResponseDTO }) => (
    <List.Item
      title={`${item.produto.nome} (x${item.quantidade})`}
      description={item.precoUnitario ? `R$ ${item.precoUnitario.toFixed(2)} cada | Total: R$ ${(item.precoUnitario * item.quantidade).toFixed(2)}` : 'Preço não informado'}
      onPress={() => handleEditItem(item.produto.id)}
      right={() => (
        <IconButton 
          icon="trash-can-outline" 
          iconColor="red" 
          onPress={() => handleRemoveItem(item.produto.id)} 
        />
      )}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lista.itens}
        renderItem={renderItem}
        keyExtractor={(item) => item.produto.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item na lista.</Text>}
        ItemSeparatorComponent={Divider}
      />
      <View style={styles.footer}>
        <Text variant="titleLarge">Total Gasto: R$ {totalGasto.toFixed(2)}</Text>
        <Button 
          mode="contained" 
          icon="plus"
          style={styles.addButton}
          onPress={() => navigation.navigate('ItemForm', { listaId })}
        >
          Adicionar Item
        </Button>
      </View>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  addButton: { marginTop: 8 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ListaDetailScreen;