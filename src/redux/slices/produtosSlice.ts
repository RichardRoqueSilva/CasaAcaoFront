import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {apiClient} from '../../api/client';
import { ProdutoResponseDTO } from '../../types';

// Interface para os dados enviados ao criar ou atualizar um produto
interface ProdutoRequestDTO {
  nome: string;
  categoriaId: number;
}

// Interface para os dados enviados ao atualizar, contendo o ID e os novos dados
interface UpdateProdutoPayload {
  id: number;
  data: ProdutoRequestDTO;
}

// A "forma" do nosso estado para este slice
interface ProdutosState {
  produtos: ProdutoResponseDTO[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// O estado inicial quando o aplicativo carrega
const initialState: ProdutosState = {
  produtos: [],
  status: 'idle',
  error: null,
};

// --- Thunks Assíncronos (Ações que interagem com a API) ---

// 1. Ação para BUSCAR todos os produtos
export const fetchProdutos = createAsyncThunk(
  'produtos/fetchProdutos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ProdutoResponseDTO[]>('/produtos');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Falha ao buscar produtos');
    }
  }
);

// 2. Ação para ADICIONAR um novo produto
export const addProduto = createAsyncThunk(
  'produtos/addProduto',
  async (novoProduto: ProdutoRequestDTO, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ProdutoResponseDTO>('/produtos', novoProduto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao adicionar produto');
    }
  }
);

// 3. Ação para ATUALIZAR um produto existente
export const updateProduto = createAsyncThunk(
  'produtos/updateProduto',
  async ({ id, data }: UpdateProdutoPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<ProdutoResponseDTO>(`/produtos/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao atualizar produto');
    }
  }
);

// 4. Ação para DELETAR um produto
export const deleteProduto = createAsyncThunk(
  'produtos/deleteProduto',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/produtos/${id}`);
      return id; // Retorna o ID para sabermos qual remover do estado
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao deletar produto. Verifique se não está em uma lista.');
    }
  }
);


// --- O Slice de Produtos ---
const produtosSlice = createSlice({
  name: 'produtos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Casos para a ação 'fetchProdutos'
      .addCase(fetchProdutos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProdutos.fulfilled, (state, action: PayloadAction<ProdutoResponseDTO[]>) => {
        state.status = 'succeeded';
        state.produtos = action.payload;
      })
      .addCase(fetchProdutos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Caso para a ação 'addProduto'
      .addCase(addProduto.fulfilled, (state, action: PayloadAction<ProdutoResponseDTO>) => {
        state.produtos.push(action.payload);
      })
      
      // Caso para a ação 'updateProduto'
      .addCase(updateProduto.fulfilled, (state, action: PayloadAction<ProdutoResponseDTO>) => {
        const index = state.produtos.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.produtos[index] = action.payload;
        }
      })

      // Caso para a ação 'deleteProduto'
      .addCase(deleteProduto.fulfilled, (state, action: PayloadAction<number>) => {
        state.produtos = state.produtos.filter(p => p.id !== action.payload);
      });
  },
});

export default produtosSlice.reducer;