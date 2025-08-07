import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
import { Portal } from 'react-native-paper';

export default function App() {
  return (
    // 1. Provedor do Redux: torna o 'store' acessível a toda a app
    <StoreProvider store={store}>
      {/* 2. Provedor do React Native Paper: habilita o uso dos componentes de UI */}
      <PaperProvider>
        <Portal>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </Portal>
      </PaperProvider>
    </StoreProvider>
  );
}
