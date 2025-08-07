import axios from 'axios';

// ATENÇÃO: SUBSTITUA PELO IP DA SUA MÁQUINA!
// 'localhost' não funciona em celulares/emuladores.
// Para descobrir seu IP, no terminal do seu computador, digite:
// - Windows: ipconfig
// - macOS/Linux: ifconfig | grep "inet "
const BASE_URL = 'http://192.168.1.10:8080/api'; // Exemplo: use seu IP aqui

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});