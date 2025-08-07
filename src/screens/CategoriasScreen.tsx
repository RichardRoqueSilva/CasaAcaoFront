// src/screens/CategoriasScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { List, Appbar, Menu, Divider, Portal, Dialog, Button, Text } from 'react-native-paper';

import { AppDispatch, RootState } from '../redux/store';
import { fetchCategorias, deleteCategoria } from '../redux/slices/categoriasSlice';

import DataContainer from '../components/DataContainer';
import { CategoriasStackParamList } from '../navigation/CategoriasNavigator';

type ListItemIconProps = { color: string; };
type CategoriasScreenNavigationProp = NativeStackNavigationProp<CategoriasStackParamList, 'CategoriasList'>;

const CategoriasScreen = () => {
  const navigation = useNavigation<CategoriasScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { categorias, status, error } = useSelector((state: RootState) => state.categorias);

  // Estados para controlar a UI
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [categoriaParaDeletar, setCategoriaParaDeletar] = useState<number | null>(null);
  // Busca os dados quando o componente é montado pela primeira vez.


  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategorias());
    }
  }, [status, dispatch]);

  // Função para ser chamada pelo DataContainer em caso de erro.
  const handleRetry = () => {
    dispatch(fetchCategorias());
  };

  // Funções para controlar o menu e o diálogo
  const openMenu = (id: number) => setVisibleMenu(id);
  const closeMenu = () => setVisibleMenu(null);
  
  const showDeleteDialog = (id: number) => {
    setCategoriaParaDeletar(id);
    setDialogVisible(true);
    closeMenu();
  };

  const hideDeleteDialog = () => {
    setDialogVisible(false);
    setCategoriaParaDeletar(null);
  };

  const handleDeleteConfirm = () => {
    if (categoriaParaDeletar !== null) {
      dispatch(deleteCategoria(categoriaParaDeletar));
    }
    hideDeleteDialog();
  };

  const handleEdit = (id: number) => {
    navigation.navigate('CategoriaForm', { categoriaId: id });
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Categorias" />
        <Appbar.Action icon="plus" onPress={() => navigation.navigate('CategoriaForm', {})} />
      </Appbar.Header>

      <DataContainer status={status} error={error} onRetry={handleRetry}>
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.nome}
              description={item.descricao || 'Sem descrição'}
              left={(props: ListItemIconProps) => <List.Icon {...props} icon="tag-outline" />}
              // Prop 'right' para adicionar o menu de opções
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

      {/* Portal para o Diálogo de Confirmação de Exclusão */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>Você tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.</Text>
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

export default CategoriasScreen;