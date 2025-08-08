import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { addCategoria, updateCategoria } from '../redux/slices/categoriasSlice';
import { AppDispatch, RootState } from '../redux/store';
import { CategoriasStackParamList } from '../navigation/CategoriasNavigator';

import { colors } from '../styles/theme';

// Definindo o tipo da rota para esta tela
type CategoriaFormScreenRouteProp = RouteProp<CategoriasStackParamList, 'CategoriaForm'>;

const CategoriaFormScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute<CategoriaFormScreenRouteProp>();
  
  // Verifica se um ID foi passado. Se sim, estamos em modo de edição.
  const categoriaId = route.params?.categoriaId;
  const isEditing = !!categoriaId;

  // Busca a categoria do estado do Redux se estivermos editando
  const categoriaExistente = useSelector((state: RootState) => 
    isEditing ? state.categorias.categorias.find(c => c.id === categoriaId) : null
  );

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Efeito para preencher o formulário com dados existentes ao entrar em modo de edição
  useEffect(() => {
    if (isEditing && categoriaExistente) {
      setNome(categoriaExistente.nome);
      setDescricao(categoriaExistente.descricao || '');
    }
  }, [isEditing, categoriaExistente]);

  const handleSave = async () => {
    if (!nome.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }
    
    Keyboard.dismiss();
    setLoading(true);
    setError('');

        try {
      if (isEditing) {
        // Se estiver editando, despacha a ação de update
        await dispatch(updateCategoria({ id: categoriaId, data: { nome, descricao } })).unwrap();
      } else {
        // Se não, despacha a ação de adicionar
        await dispatch(addCategoria({ nome, descricao })).unwrap();
      }
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  // Configura os botões do cabeçalho dinamicamente
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Categoria' : 'Nova Categoria', // Título dinâmico
      headerRight: () => (
        <Button onPress={handleSave} loading={loading} disabled={loading}>
          Salvar
        </Button>
      ),
    });
  }, [navigation, nome, descricao, loading, isEditing]);

  return (
    <View style={[styles.formContainer, { backgroundColor: colors.categoriasLight }]}>
      {/* ... O JSX do formulário continua o mesmo ... */}
      <TextInput label="Nome da Categoria" value={nome} onChangeText={setNome} mode="outlined" style={styles.input} error={!!error} />
      <TextInput label="Descrição (Opcional)" value={descricao} onChangeText={setDescricao} mode="outlined" style={styles.input} multiline numberOfLines={3} />
      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 16 },
});

export default CategoriaFormScreen;