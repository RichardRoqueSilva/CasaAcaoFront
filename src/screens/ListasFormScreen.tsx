import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { addLista, updateLista } from '../redux/slices/listasSlice';
import { AppDispatch, RootState } from '../redux/store';
import { ListasStackParamList } from '../navigation/ListasNavigator';
// ESTA IMPORTAÇÃO AGORA VAI FUNCIONAR CORRETAMENTE
import { ListaRequestDTO } from '../types';
import { colors } from '../styles/theme';

type ListaFormScreenRouteProp = RouteProp<ListasStackParamList, 'ListaForm'>;

const ListaFormScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute<ListaFormScreenRouteProp>();

  const listaId = route.params?.listaId;
  const isEditing = !!listaId;
  const listaExistente = useSelector((state: RootState) => 
    isEditing ? state.listas.listas.find(l => l.id === listaId) : null
  );

  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && listaExistente) {
      setNome(listaExistente.nome);
    }
  }, [isEditing, listaExistente]);

  const handleSave = async () => {
    if (!nome.trim()) {
      setError('O nome da lista é obrigatório.');
      return;
    }
    
    Keyboard.dismiss();
    setLoading(true);
    setError('');

    try {
      if (isEditing && listaExistente) {
        // Agora o tipo 'ListaRequestDTO' é conhecido aqui
        const data: ListaRequestDTO = {
          nome,
          usuarioId: listaExistente.usuarioId
        };
        await dispatch(updateLista({ id: listaId, data })).unwrap();
      } else {
        await dispatch(addLista({ nome, usuarioId: 1 })).unwrap();
      }
      navigation.goBack();
    } catch (err: any) {
      console.error('Erro ao salvar lista:', err);
      setError(typeof err === 'string' ? err : 'Ocorreu um erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Lista' : 'Nova Lista',
      headerRight: () => (
        <Button onPress={handleSave} loading={loading} disabled={loading}>
          Salvar
        </Button>
      ),
    });
  }, [navigation, nome, loading, isEditing]);

  return (
    <View style={styles.formContainer}>
      <TextInput
        label="Nome da Lista"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
        style={styles.input}
        error={!!error}
      />
      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 16 },
});

export default ListaFormScreen;