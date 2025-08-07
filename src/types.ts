// src/types.ts

export interface CategoriaResponseDTO {
  id: number;
  nome: string;
  descricao?: string;
}

export interface ProdutoResponseDTO {
  id: number;
  nome: string;
  categoria: CategoriaResponseDTO;
}

export interface ItemListaResponseDTO {
  produto: ProdutoResponseDTO;
  quantidade: number;
  precoUnitario?: number;
  comprado: boolean;
}

export interface ListaResponseDTO {
  id: number;
  nome: string;
  dataCriacao: string; // Vem como string da API
  usuarioId: number;
  itens: ItemListaResponseDTO[];
}

export interface ListaRequestDTO {
  nome: string;
  usuarioId: number;
}