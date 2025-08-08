import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
// Adicione 'TouchableRipple' para dar feedback de clique na lista
import { Modal, Portal, Searchbar, List, Divider, Text, TouchableRipple } from 'react-native-paper';

// Tipagem genérica para tornar o componente reutilizável
interface SelectItem {
  id: number | string;
  label: string;
}

interface SearchableSelectModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (item: SelectItem) => void;
  items: SelectItem[];
  title: string;
}

const SearchableSelectModal: React.FC<SearchableSelectModalProps> = ({
  visible,
  onDismiss,
  onSelect,
  items,
  title,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Lógica para filtrar os itens com base na busca do usuário
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função chamada quando um item da lista é pressionado
  const handleItemPress = (item: SelectItem) => {
    onSelect(item);
    onDismiss(); // Fecha o modal após a seleção
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <View style={styles.header}>
          <Text variant="titleLarge">{title}</Text>
        </View>
        <Searchbar
          placeholder="Pesquisar..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          autoFocus // Foca na barra de busca assim que o modal abre
        />
        
        {/* --- AQUI ESTÁ A PARTE QUE FALTAVA --- */}
        {/* Usamos FlatList para renderizar a lista de itens de forma performática */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // TouchableRipple dá um efeito visual ao clicar no item
            <TouchableRipple onPress={() => handleItemPress(item)}>
              <List.Item title={item.label} />
            </TouchableRipple>
          )}
          ItemSeparatorComponent={Divider} // Adiciona uma linha divisória entre os itens
          // Mostra uma mensagem se a busca não retornar nenhum resultado
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item encontrado.</Text>}
          keyboardShouldPersistTaps="handled" // Garante que o clique funcione mesmo com o teclado aberto
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%', // Limita a altura do modal para não ocupar a tela toda
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  searchbar: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default SearchableSelectModal;