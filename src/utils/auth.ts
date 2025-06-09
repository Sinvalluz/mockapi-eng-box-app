import { readFile } from "fs/promises";
import path from "path";

export interface UsuarioResponse {
  email: string;
  nome: string;
  senha: string;
}

export interface Usuario {
  id: number;
  email: string;
  token: string;
  senha: string;
  nome: string;
  telefone: string;
  nivelConsciencia: number;
  isMonitor: boolean;
  profilePhotoUrl: string;
  posts?: Post[];
}

// Armazenamento simulado
export let usuarios: Usuario[] = [];

// Função para carregar usuários do arquivo JSON
export async function carregarUsuarios() {
  const filePath = path.join(__dirname, "..", "..", "public", "usuarios.json");
  const data = await readFile(filePath, "utf-8");
  usuarios = JSON.parse(data);
}

export interface Post {
  id: string;
  dataCriacao: string;
  titulo: string;
  tema: string;
  subtemas: string;
  conteudo: string;
  fotos: Foto[];
}

export interface Foto {
  url: string;
  name: string;
  type: string;
}
