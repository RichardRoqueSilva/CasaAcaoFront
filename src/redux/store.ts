import { configureStore } from '@reduxjs/toolkit';
import categoriasReducer from './slices/categoriasSlice';
import produtosReducer from './slices/produtosSlice'; // Importe o novo reducer
import listasReducer from './slices/listasSlice';     // Importe o novo reducer

export const store = configureStore({
  reducer: {
    categorias: categoriasReducer,
    produtos: produtosReducer, // Registre aqui
    listas: listasReducer,     // Registre aqui
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;