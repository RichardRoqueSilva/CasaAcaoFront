import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {apiClient} from '../../api/client';
import { CategoriaResponseDTO } from '../../types';

// Interface para os dados enviados ao criar uma nova categoria
interface CategoriaRequestDTO {
  nome: string;
  descricao?: string;
}

// Interface para os dados enviados ao atualizar, contendo o ID e os novos dados
interface UpdateCategoriaPayload {
  id: number;
  data: CategoriaRequestDTO;
}

// A "forma" do nosso estado para este slice
interface CategoriasState {
  categorias: CategoriaResponseDTO[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// O estado inicial quando o aplicativo carrega
const initialState: CategoriasState = {
  categorias: [],
  status: 'idle', // ocioso, carregando, sucesso, falha
  error: null,
};

// --- Thunks Assíncronos (Ações que interagem com a API) ---

// 1. Ação para BUSCAR todas as categorias
export const fetchCategorias = createAsyncThunk(
  'categorias/fetchCategorias',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<CategoriaResponseDTO[]>('/categorias');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Falha ao buscar categorias');
    }
  }
);

// 2. Ação para ADICIONAR uma nova categoria
export const addCategoria = createAsyncThunk(
  'categorias/addCategoria',
  async (novaCategoria: CategoriaRequestDTO, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<CategoriaResponseDTO>('/categorias', novaCategoria);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro de servidor ao adicionar categoria');
    }
  }
);

// 3. Ação para ATUALIZAR uma categoria existente
export const updateCategoria = createAsyncThunk(
  'categorias/updateCategoria',
  async ({ id, data }: UpdateCategoriaPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<CategoriaResponseDTO>(`/categorias/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao atualizar categoria');
    }
  }
);

// 4. Ação para DELETAR uma categoria
export const deleteCategoria = createAsyncThunk(
  'categorias/deleteCategoria',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/categorias/${id}`);
      return id; // Retorna o ID para sabermos qual remover do estado
    } catch (error: any){
      return rejectWithValue(error.response?.data?.message || 'Erro ao deletar categoria. Verifique se não há produtos associados.');
    }
  }
);


// --- O Slice de Categorias ---
const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {},
  // 'extraReducers' lida com as ações assíncronas e atualiza o estado de acordo
  extraReducers: (builder) => {
    builder
      // Casos para a ação 'fetchCategorias'
      .addCase(fetchCategorias.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action: PayloadAction<CategoriaResponseDTO[]>) => {
        state.status = 'succeeded';
        state.categorias = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Caso para a ação 'addCategoria'
      .addCase(addCategoria.fulfilled, (state, action: PayloadAction<CategoriaResponseDTO>) => {
        // Adiciona a nova categoria à lista existente sem precisar de um novo fetch.
        state.categorias.push(action.payload);
      })
      
      // Caso para a ação 'updateCategoria'
      .addCase(updateCategoria.fulfilled, (state, action: PayloadAction<CategoriaResponseDTO>) => {
        // Encontra o índice da categoria atualizada e a substitui na lista.
        const index = state.categorias.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categorias[index] = action.payload;
        }
      })

      // Caso para a ação 'deleteCategoria'
      .addCase(deleteCategoria.fulfilled, (state, action: PayloadAction<number>) => {
        // Filtra a lista, removendo a categoria com o ID que foi deletado.
        state.categorias = state.categorias.filter(cat => cat.id !== action.payload);
      });
  },
});

export default categoriasSlice.reducer;