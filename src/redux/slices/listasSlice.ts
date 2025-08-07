import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {apiClient} from '../../api/client';
import { ListaResponseDTO, ListaRequestDTO } from '../../types';

// --- Interfaces de Payload Específicas ---

// DTO para ADICIONAR um novo item a uma lista
interface ItemListaRequestDTO {
  produtoId: number;
  quantidade: number;
  precoUnitario?: number;
}

// DTO para ATUALIZAR um item existente (não precisa do produtoId no corpo da requisição)
interface ItemUpdateRequestDTO {
  quantidade: number;
  precoUnitario?: number;
}

// Payload para a ação de ATUALIZAR uma lista
interface UpdateListaPayload {
  id: number;
  data: ListaRequestDTO;
}

// --- Definição do Estado do Slice ---

interface ListasState {
  listas: ListaResponseDTO[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ListasState = {
  listas: [],
  status: 'idle',
  error: null,
};

// --- Thunks Assíncronos ---

// THUNKS PARA GERENCIAMENTO DE LISTAS (CRUD)
export const fetchListas = createAsyncThunk('listas/fetchListas', async (_, { rejectWithValue }) => { try { const response = await apiClient.get<ListaResponseDTO[]>('/listas'); return response.data; } catch (e: any) { return rejectWithValue(e.response?.data?.message); } });
export const addLista = createAsyncThunk('listas/addLista', async (data: ListaRequestDTO, { rejectWithValue }) => { try { const response = await apiClient.post<ListaResponseDTO>('/listas', data); return response.data; } catch (e: any) { return rejectWithValue(e.response?.data?.message); } });
export const updateLista = createAsyncThunk('listas/updateLista', async ({ id, data }: UpdateListaPayload, { rejectWithValue }) => { try { const response = await apiClient.put<ListaResponseDTO>(`/listas/${id}`, data); return response.data; } catch (e: any) { return rejectWithValue(e.response?.data?.message); } });
export const deleteLista = createAsyncThunk('listas/deleteLista', async (id: number, { rejectWithValue }) => { try { await apiClient.delete(`/listas/${id}`); return id; } catch (e: any) { return rejectWithValue(e.response?.data?.message); } });

// THUNKS PARA GERENCIAMENTO DE ITENS DENTRO DE UMA LISTA
export const addItemNaLista = createAsyncThunk('listas/addItemNaLista', async ({ listaId, item }: { listaId: number; item: ItemListaRequestDTO }, { rejectWithValue }) => { try { const response = await apiClient.post<ListaResponseDTO>(`/listas/${listaId}/itens`, item); return response.data; } catch (e: any) { return rejectWithValue(e.response?.data?.message); } });
export const removeItemDaLista = createAsyncThunk('listas/removeItemDaLista', async ({ listaId, produtoId }: { listaId: number; produtoId: number }, { rejectWithValue }) => { try { await apiClient.delete(`/listas/${listaId}/itens/${produtoId}`); return { listaId, produtoId }; } catch (e: any) { return rejectWithValue(e.response?.data?.message); } });

// CORREÇÃO: O thunk agora espera o tipo 'ItemUpdateRequestDTO'
export const updateItemNaLista = createAsyncThunk(
  'listas/updateItemNaLista',
  async ({ listaId, produtoId, data }: { listaId: number; produtoId: number; data: ItemListaRequestDTO }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<ListaResponseDTO>(`/listas/${listaId}/itens/${produtoId}`, data);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message);
    }
  }
);


// --- O Slice de Listas ---
const listasSlice = createSlice({
  name: 'listas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Casos para Listas (CRUD)
      .addCase(fetchListas.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchListas.fulfilled, (state, action) => { state.status = 'succeeded'; state.listas = action.payload as ListaResponseDTO[]; })
      .addCase(fetchListas.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
      .addCase(addLista.fulfilled, (state, action) => { state.listas.push({ ...action.payload, itens: [] }); })
      .addCase(updateLista.fulfilled, (state, action) => {
        const index = state.listas.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          const existingItens = state.listas[index].itens;
          state.listas[index] = { ...action.payload, itens: existingItens };
        }
      })
      .addCase(deleteLista.fulfilled, (state, action) => {
        state.listas = state.listas.filter(l => l.id !== action.payload);
      })
      
      // Casos para Itens de Lista (Adicionar, Atualizar, Remover)
      .addCase(addItemNaLista.fulfilled, (state, action: PayloadAction<ListaResponseDTO>) => {
        const index = state.listas.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.listas[index] = action.payload;
        }
      })
      .addCase(updateItemNaLista.fulfilled, (state, action: PayloadAction<ListaResponseDTO>) => {
        const index = state.listas.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.listas[index] = action.payload;
        }
      })
      .addCase(removeItemDaLista.fulfilled, (state, action: PayloadAction<{ listaId: number; produtoId: number }>) => {
        const lista = state.listas.find(l => l.id === action.payload.listaId);
        if (lista) {
          lista.itens = lista.itens.filter(item => item.produto.id !== action.payload.produtoId);
        }
      });
  },
});

export default listasSlice.reducer;