import { readFile } from "fs/promises";
import path from "path";

export interface Usuario {
  email: string;
  token: string;
  senha: string;
  nome: string;
  telefone: string;
  nivelConsciencia: number;
  isMonitor: boolean;
  profilePhotoUrl: string;
}

// Armazenamento simulado
export let usuarios: Usuario[] = [];

// Função para carregar usuários do arquivo JSON
export async function carregarUsuarios() {
  const filePath = path.join(__dirname, "..", "..", "usuarios.json");
  const data = await readFile(filePath, "utf-8");
  usuarios = JSON.parse(data);
}

export interface Post {
  id: number;
  idUsuario: string;
  dataCriacao: string;
  titulo: string;
  tema: string;
  subtemas: string;
  conteudo: string;
  fotos: Foto[];
}

export interface Foto {
  uri: string;
  name: string;
  type: string;
}
