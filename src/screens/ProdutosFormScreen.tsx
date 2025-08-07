// src/screens/ProdutoFormScreen.tsx
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, HelperText, Menu, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { addProduto, updateProduto } from '../redux/slices/produtosSlice';
import { AppDispatch, RootState } from '../redux/store';
import { ProdutosStackParamList } from '../navigation/ProdutosNavigator';

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
      if (isEditing) {
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

  const selectedCategoriaNome = categorias.find(c => c.id === categoriaId)?.nome || 'Selecione uma categoria';

  return (
    <View style={styles.formContainer}>
      <TextInput
        label="Nome da Despesa"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
        style={styles.input}
        error={!!error}
      />
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.input}>
            {selectedCategoriaNome}
          </Button>
        }
      >
        {categorias.map(cat => (
          <Menu.Item
            key={cat.id}
            onPress={() => {
              setCategoriaId(cat.id);
              setMenuVisible(false);
            }}
            title={cat.nome}
          />
        ))}
      </Menu>

      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 16 },
});

export default ProdutoFormScreen;