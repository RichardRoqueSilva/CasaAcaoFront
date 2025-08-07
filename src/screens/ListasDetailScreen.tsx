import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Button, List, IconButton, Text, Divider, Snackbar, Portal, Checkbox } from 'react-native-paper';
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

  // Busca a lista original do Redux (nossa "fonte da verdade")
  const listaOriginal = useSelector((state: RootState) => 
    state.listas.listas.find(l => l.id === listaId)
  );

  // --- ESTADO LOCAL PARA OS ITENS MARCADOS ---
  // Usamos um Set para performance otimizada ao adicionar/remover/verificar IDs.
  const [itensComprados, setItensComprados] = useState(new Set<number>());
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Sincroniza o estado local com os dados do Redux quando a tela carrega
  useEffect(() => {
    if (listaOriginal) {
      const compradosInicialmente = new Set(
        listaOriginal.itens.filter(item => item.comprado).map(item => item.produto.id)
      );
      setItensComprados(compradosInicialmente);
    }
  }, [listaOriginal]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: listaNome });
  }, [navigation, listaNome]);

  const handleRemoveItem = async (produtoId: number) => {
    // A lógica de remover continua a mesma, pois precisa persistir
    try {
      await dispatch(removeItemDaLista({ listaId, produtoId })).unwrap();
    } catch (error: any) {
      setSnackbarMessage(typeof error === 'string' ? error : 'Falha ao remover item');
      setSnackbarVisible(true);
    }
  };
  
  const handleEditItem = (produtoId: number) => {
    navigation.navigate('ItemForm', { listaId, produtoId });
  };

  // --- NOVA FUNÇÃO PARA O TOGGLE VISUAL ---
  const handleToggleComprado = (produtoId: number) => {
    // Criamos uma nova cópia do Set para garantir a imutabilidade e a re-renderização
    setItensComprados(prevComprados => {
      const novosComprados = new Set(prevComprados);
      if (novosComprados.has(produtoId)) {
        novosComprados.delete(produtoId); // Se já tem, remove (uncheck)
      } else {
        novosComprados.add(produtoId); // Se não tem, adiciona (check)
      }
      return novosComprados;
    });
  };

  // O cálculo do total gasto agora se baseia nos itens marcados no estado local
  const totalGasto = listaOriginal?.itens.reduce((acc, item) => {
    if (itensComprados.has(item.produto.id)) { // Só soma se o item estiver no nosso Set de 'comprados'
      const preco = item.precoUnitario || 0;
      return acc + (preco * item.quantidade);
    }
    return acc;
  }, 0) || 0;

  if (!listaOriginal) {
    return (
      <View style={styles.centered}><Text>Lista não encontrada.</Text></View>
    );
  }

  const renderItem = ({ item }: { item: ItemListaResponseDTO }) => {
    // Verifica se o item está comprado usando nosso estado local
    const isComprado = itensComprados.has(item.produto.id);
    
    return (
      <List.Item
        title={`${item.produto.nome} (x${item.quantidade})`}
        description={item.precoUnitario ? `R$ ${item.precoUnitario.toFixed(2)} cada` : 'Preço não informado'}
        titleStyle={isComprado ? styles.itemComprado : null}
        descriptionStyle={isComprado ? styles.itemComprado : null}
        onPress={() => handleEditItem(item.produto.id)}
        left={() => (
          <Checkbox.Android
            status={isComprado ? 'checked' : 'unchecked'}
            onPress={() => handleToggleComprado(item.produto.id)}
          />
        )}
        right={() => (
          <IconButton 
            icon="trash-can-outline" 
            iconColor="red" 
            onPress={() => handleRemoveItem(item.produto.id)} 
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listaOriginal.itens}
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
        <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
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
  itemComprado: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default ListaDetailScreen;