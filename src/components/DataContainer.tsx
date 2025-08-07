import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

interface DataContainerProps {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
}

const DataContainer: React.FC<DataContainerProps> = ({ status, error, onRetry, children }) => {
  if (status === 'loading' || status === 'idle') {
    return <ActivityIndicator animating={true} size="large" style={styles.centered} />;
  }

  if (status === 'failed') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <Button mode="contained" onPress={onRetry} icon="refresh">
          Tentar Novamente
        </Button>
      </View>
    );
  }

  // Se o status for 'succeeded', renderiza o conteúdo filho
  return <>{children}</>;
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 16,
    color: 'red',
  },
});

export default DataContainer;