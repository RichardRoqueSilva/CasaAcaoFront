import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button, TextInput, HelperText, Menu } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppDispatch, RootState } from '../redux/store';
import { ListasStackParamList } from '../navigation/ListasNavigator';
import { addItemNaLista, updateItemNaLista } from '../redux/slices/listasSlice';
import SearchableSelectModal from '../components/SearchableSelectModal'; 

type ItemFormRouteProp = RouteProp<ListasStackParamList, 'ItemForm'>;

const ItemFormScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute<ItemFormRouteProp>();
  const { listaId, produtoId } = route.params;

  const isEditing = !!produtoId;
  const itemExistente = useSelector((state: RootState) =>
    isEditing ? state.listas.listas.find(l => l.id === listaId)?.itens.find(i => i.produto.id === produtoId) : null
  );
  
  const { produtos } = useSelector((state: RootState) => state.produtos);

  // Estados locais para o formulário
  const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState('1');
  const [preco, setPreco] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Preenche o formulário para edição
  useEffect(() => {
    if (isEditing && itemExistente) {
      setSelectedProdutoId(itemExistente.produto.id);
      setQuantidade(itemExistente.quantidade.toString());
      setPreco(itemExistente.precoUnitario?.toString().replace('.', ',') || '');
    }
  }, [isEditing, itemExistente]);

  const handleSave = async () => {
    // Validação de campos obrigatórios
    if ((!isEditing && !selectedProdutoId) || !quantidade.trim()) {
      setError('Produto e quantidade são obrigatórios.');
      return;
    }
    
    Keyboard.dismiss();
    setLoading(true);
    setError('');

    // --- LÓGICA DE CONVERSÃO DE PREÇO SEGURA ---
    let precoNumerico: number | undefined;
    if (preco && preco.trim() !== '') {
      const valorFormatado = preco.replace(',', '.');
      const valorParseado = parseFloat(valorFormatado);
      
      if (!isNaN(valorParseado) && valorParseado >= 0) {
        precoNumerico = valorParseado;
      } else {
        setError('O preço inserido é inválido.');
        setLoading(false);
        return;
      }
    } else {
      // Se o campo estiver vazio, o preço será enviado como undefined (ou null para o backend)
      precoNumerico = undefined;
    }
    
    try {
      if (isEditing && produtoId) {
        const data = {
          produtoId, // Incluímos o produtoId
          quantidade: parseInt(quantidade, 10),
          precoUnitario: precoNumerico,
        };
        await dispatch(updateItemNaLista({ listaId, produtoId, data })).unwrap();
      } else if (selectedProdutoId) {
        // A lógica de adicionar já está correta
        const item = {
          produtoId: selectedProdutoId,
          quantidade: parseInt(quantidade, 10),
          precoUnitario: precoNumerico,
        };
        await dispatch(addItemNaLista({ listaId, item })).unwrap();
      }
      navigation.goBack();
    } catch (err: any) {
      console.error("Erro ao salvar item:", err);
      setError(typeof err === 'string' ? err : 'Ocorreu um erro ao salvar o item.');
    } finally {
      setLoading(false);
    }
  };

  // Configura o cabeçalho dinamicamente
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Item' : 'Adicionar Item',
      headerRight: () => <Button onPress={handleSave} loading={loading} disabled={loading}>Salvar</Button>,
    });
  }, [navigation, selectedProdutoId, quantidade, preco, loading, isEditing]);

  const produtosParaSelecao = produtos.map(p => ({
    id: p.id,
    label: p.nome,
  }));
  const selectedProdutoNome = produtos.find(p => p.id === selectedProdutoId)?.nome || 'Selecione um produto';

  return (
    <View style={styles.container}>
      {isEditing && itemExistente ? (
        <TextInput
          label="Produto"
          value={itemExistente.produto.nome}
          mode="outlined"
          style={styles.input}
          disabled
        />
      ) : (
        // --- 4. SUBSTITUIÇÃO DO <Menu> PELO NOVO SELETOR ---
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <View>
            <TextInput
              label="Produto"
              value={selectedProdutoNome}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
              style={styles.input}
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      <TextInput
        label="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Preço Unitário (Ex: 12,50)"
        value={preco}
        onChangeText={setPreco}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />
      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
      
      {/* --- 5. ADIÇÃO DO COMPONENTE MODAL À TELA --- */}
      {/* Ele fica invisível até que 'modalVisible' seja true */}
      <SearchableSelectModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title="Selecione uma Despesa"
        items={produtosParaSelecao}
        onSelect={(item) => {
          // Precisamos garantir que o ID é um número antes de definir o estado
          if (typeof item.id === 'number') {
            setSelectedProdutoId(item.id);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 16 },
});

export default ItemFormScreen;