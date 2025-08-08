// src/screens/ProdutoFormScreen.tsx
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button, TextInput, HelperText, Menu, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { addProduto, updateProduto } from '../redux/slices/produtosSlice';
import { AppDispatch, RootState } from '../redux/store';
import { ProdutosStackParamList } from '../navigation/ProdutosNavigator';
import SearchableSelectModal from '../components/SearchableSelectModal';

type ProdutoFormScreenRouteProp = RouteProp<ProdutosStackParamList, 'ProdutoForm'>;

const ProdutoFormScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute<ProdutoFormScreenRouteProp>();

  // Modo de edição
  const produtoId = route.params?.produtoId;
  const isEditing = !!produtoId;
  const produtoExistente = useSelector((state: RootState) => 
    isEditing ? state.produtos.produtos.find(p => p.id === produtoId) : null
  );

  // Pega a lista de categorias do Redux para popular o dropdown
  const { categorias } = useSelector((state: RootState) => state.categorias);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  // --- 2. MUDANÇA DE ESTADO: menuVisible -> modalVisible ---
  const [modalVisible, setModalVisible] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && produtoExistente) {
      setNome(produtoExistente.nome);
      setCategoriaId(produtoExistente.categoria.id);
    }
  }, [isEditing, produtoExistente]);

  const handleSave = async () => {
    if (!nome.trim() || !categoriaId) {
      setError('Nome e categoria são obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = { nome, categoriaId };
      if (isEditing && produtoId) {
        await dispatch(updateProduto({ id: produtoId, data })).unwrap();
      } else {
        await dispatch(addProduto(data)).unwrap();
      }
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Despesa' : 'Nova Despesa',
      headerRight: () => (
        <Button onPress={handleSave} loading={loading} disabled={loading}>
          Salvar
        </Button>
      ),
    });
  }, [navigation, nome, categoriaId, loading, isEditing]);

  // --- 3. NOVA LÓGICA PARA PREPARAR OS DADOS PARA O MODAL ---
  const categoriasParaSelecao = categorias.map(cat => ({ id: cat.id, label: cat.nome }));
  const selectedCategoriaNome = categorias.find(c => c.id === categoriaId)?.nome || 'Selecione uma categoria';

  return (
    <View style={styles.formContainer}>
      <TextInput
        // Corrigi o label para "Nome do Produto"
        label="Nome da Despesa"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
        style={styles.input}
        error={!!error}
      />
      
      {/* --- 4. SUBSTITUIÇÃO DO <Menu> PELO NOVO SELETOR --- */}
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View>
          <TextInput
            label="Categoria"
            value={selectedCategoriaNome}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="menu-down" />}
            style={styles.input}
          />
        </View>
      </TouchableWithoutFeedback>

      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
      
      {/* --- 5. ADIÇÃO DO COMPONENTE MODAL À TELA --- */}
      <SearchableSelectModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title="Selecione uma Categoria"
        items={categoriasParaSelecao}
        onSelect={(item) => {
          if (typeof item.id === 'number') {
            setCategoriaId(item.id);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 16 },
});

export default ProdutoFormScreen;