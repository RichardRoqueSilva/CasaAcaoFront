import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { List, Appbar, Menu, Divider, Portal, Dialog, Button, Text, TouchableRipple, Snackbar, IconButton } from 'react-native-paper';

import { AppDispatch, RootState } from '../redux/store';
import { fetchListas, deleteLista } from '../redux/slices/listasSlice';
import DataContainer from '../components/DataContainer';
import { ListasStackParamList } from '../navigation/ListasNavigator';
import { ListaResponseDTO } from '../types';
import { colors } from '../styles/theme';

type ListasScreenNavigationProp = NativeStackNavigationProp<ListasStackParamList, 'ListasList'>;

const ListasScreen = () => {
  const navigation = useNavigation<ListasScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { listas, status, error } = useSelector((state: RootState) => state.listas);

  // Estados para o menu de opções e diálogo de exclusão
  const [visibleMenuId, setVisibleMenuId] = useState<number | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [listaParaDeletar, setListaParaDeletar] = useState<number | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isErrorSnackbar, setIsErrorSnackbar] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchListas());
    }
  }, [status, dispatch]);

  // Handlers para as ações
  const handleRetry = () => dispatch(fetchListas());
  const openMenu = (id: number) => setVisibleMenuId(id);
  const closeMenu = () => setVisibleMenuId(null);
  
  const showDeleteDialog = (id: number) => {
    setListaParaDeletar(id);
    setDialogVisible(true);
    closeMenu();
  };
  const hideDeleteDialog = () => {
    setDialogVisible(false);
    setListaParaDeletar(null);
  };
  const handleDeleteConfirm = async () => {
    if (listaParaDeletar !== null) {
      try {
        await dispatch(deleteLista(listaParaDeletar)).unwrap();
        setSnackbarMessage('Lista excluída com sucesso!');
        setIsErrorSnackbar(false);
        setSnackbarVisible(true);
      } catch (err: any) {
        setSnackbarMessage(typeof err === 'string' ? err : 'Falha ao excluir a lista.');
        setIsErrorSnackbar(true);
        setSnackbarVisible(true);
      }
    }
    hideDeleteDialog();
  };
  const handleEdit = (id: number) => {
    navigation.navigate('ListaForm', { listaId: id });
    closeMenu();
  };

  // Nova função para navegar para a tela de detalhes
  const handleNavigateToDetail = (listaId: number, listaNome: string) => {
    navigation.navigate('ListaDetail', { listaId, listaNome });
  };

  const renderListaItem = ({ item: lista }: { item: ListaResponseDTO }) => {
    return (
      <TouchableRipple onPress={() => handleNavigateToDetail(lista.id, lista.nome)}>
        <List.Item
          title={lista.nome}
          description={`${lista.itens.length} iten(s)`}
          left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
          right={() => (
            <Menu
              visible={visibleMenuId === lista.id}
              onDismiss={closeMenu}
              anchor={
                <IconButton icon="dots-vertical" onPress={() => openMenu(lista.id)} />
              }
            >
              <Menu.Item onPress={() => handleEdit(lista.id)} title="Editar Nome" />
              <Divider />
              <Menu.Item onPress={() => showDeleteDialog(lista.id)} title="Excluir Lista" titleStyle={{ color: 'red' }} />
            </Menu>
          )}
        />
      </TouchableRipple>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.listasLight }]}>
      {/* <<< 3. APLIQUE A COR ESCURA NO CABEÇALHO */}
      <Appbar.Header style={{ backgroundColor: colors.listasDark }}>
        <Appbar.Content title="Minhas Listas" />
        <Appbar.Action icon="plus" onPress={() => navigation.navigate('ListaForm', {})} />
      </Appbar.Header>

      <DataContainer status={status} error={error} onRetry={handleRetry}>
        <FlatList
          data={listas}
          renderItem={renderListaItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={Divider}
        />
      </DataContainer>
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Content><Text>Você tem certeza que deseja excluir esta lista?</Text></Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancelar</Button>
            <Button onPress={handleDeleteConfirm} textColor="red">Excluir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: isErrorSnackbar ? '#B00020' : '#4CAF50' }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,},
});

export default ListasScreen;