// src/screens/ProdutosScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { List, Appbar, Menu, Divider, Portal, Dialog, Button, Text } from 'react-native-paper';

import { AppDispatch, RootState } from '../redux/store';
import { fetchProdutos, deleteProduto } from '../redux/slices/produtosSlice';
import DataContainer from '../components/DataContainer';
import { ProdutosStackParamList } from '../navigation/ProdutosNavigator';

type ProdutosScreenNavigationProp = NativeStackNavigationProp<ProdutosStackParamList, 'ProdutosList'>;

const ProdutosScreen = () => {
  const navigation = useNavigation<ProdutosScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { produtos, status, error } = useSelector((state: RootState) => state.produtos);

  const [visibleMenu, setVisibleMenu] = useState<number | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [produtoParaDeletar, setProdutoParaDeletar] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProdutos());
    }
  }, [status, dispatch]);

  const handleRetry = () => dispatch(fetchProdutos());
  const openMenu = (id: number) => setVisibleMenu(id);
  const closeMenu = () => setVisibleMenu(null);
  
  const showDeleteDialog = (id: number) => {
    setProdutoParaDeletar(id);
    setDialogVisible(true);
    closeMenu();
  };

  const hideDeleteDialog = () => {
    setDialogVisible(false);
    setProdutoParaDeletar(null);
  };

  const handleDeleteConfirm = () => {
    if (produtoParaDeletar !== null) {
      dispatch(deleteProduto(produtoParaDeletar));
    }
    hideDeleteDialog();
  };

  const handleEdit = (id: number) => {
    navigation.navigate('ProdutoForm', { produtoId: id });
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Despesas" />
        <Appbar.Action icon="plus" onPress={() => navigation.navigate('ProdutoForm', {})} />
      </Appbar.Header>

      <DataContainer status={status} error={error} onRetry={handleRetry}>
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.nome}
              description={`Categoria: ${item.categoria.nome}`}
              left={(props) => <List.Icon {...props} icon="package-variant-closed" />}
              right={(props) => (
                <Menu
                  visible={visibleMenu === item.id}
                  onDismiss={closeMenu}
                  anchor={
                    <Appbar.Action {...props} icon="dots-vertical" onPress={() => openMenu(item.id)} />
                  }
                >
                  <Menu.Item onPress={() => handleEdit(item.id)} title="Editar" />
                  <Divider />
                  <Menu.Item onPress={() => showDeleteDialog(item.id)} title="Excluir" titleStyle={{ color: 'red' }} />
                </Menu>
              )}
            />
          )}
        />
      </DataContainer>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>Você tem certeza que deseja excluir este produto?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancelar</Button>
            <Button onPress={handleDeleteConfirm} textColor="red">Excluir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});

export default ProdutosScreen;