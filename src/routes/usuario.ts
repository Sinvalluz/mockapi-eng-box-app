import { FastifyInstance } from "fastify";
import { usuarios, Usuario } from "../utils/auth";

let currentId = 1;

export default async function usuarioRoutes(app: FastifyInstance) {
  // POST /api/usuario
  app.post("/", async (request, reply) => {
    const data: Usuario = request.body as Usuario;

    const novoUsuario: Usuario = {
      nome: data.nome,
      senha: data.senha,
      email: data.email,
      telefone: data.telefone,
      nivelConsciencia: data.nivelConsciencia,
      isMonitor: data.isMonitor,
      fotoUsu: data.fotoUsu,
      token: data.token,
    };

    // Verifica se o email já está cadastrado
    const emailExistente = usuarios.find((u) => u.email === novoUsuario.email);
    if (emailExistente) {
      return reply.status(400).send({ error: "Email já cadastrado" });
    }

    // Adiciona o novo usuário
    usuarios.push(novoUsuario);

    return reply.send({
      message: "Usuário criado com sucesso",
    });
  });

  // POST /api/usuario/login
  app.post("/login", async (request, reply) => {
    const { email, senha } = request.body as { email: string; senha: string };

    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (!usuario) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    console.log(usuario);
    return reply.send({
      message: "Login bem-sucedido",
      email: usuario.email,
      token: usuario.token,
    });
  });

  // GET /api/usuario
  app.get("/", async (_, reply) => {
    return reply.send(usuarios.map(({ senha, ...rest }) => rest)); // remove senha
  });
}
