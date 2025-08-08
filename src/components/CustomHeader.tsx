import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { colors } from '../styles/theme';

interface CustomHeaderProps {
  backgroundColor: string;
  onCancel: () => void;
  title: string;
  onSave: () => void;
  isSaveLoading?: boolean;
  isSaveDisabled?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  backgroundColor,
  onCancel,
  title,
  onSave,
  isSaveLoading = false,
  isSaveDisabled = false,
}) => {
  return (
    <Appbar.Header style={[styles.header, { backgroundColor }]}>
      {/* Usamos Views com flex: 1 para distribuir o espaço */}
      <View style={styles.buttonContainer}>
        <Button onPress={onCancel} textColor={colors.white} labelStyle={styles.buttonLabel}>
          Cancelar
        </Button>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={onSave} loading={isSaveLoading} disabled={isSaveDisabled} textColor={colors.white} labelStyle={styles.buttonLabel}>
          Salvar
        </Button>
      </View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between', // Distribui os itens filhos
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1, // Cada container de botão ocupa 1/3 do espaço
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1.5, // Damos um pouco mais de espaço para o título para evitar quebra de linha
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
});

export default CustomHeader;