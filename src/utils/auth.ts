export interface Usuario {
  email: string;
  token: string;
  senha: string;
  nome: string;
  telefone: string;
  nivelConsciencia: string;
  isMonitor: boolean;
  fotoUsu: string;
}

// Armazenamento simulado
export const usuarios: Usuario[] = [];
