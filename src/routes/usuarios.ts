import { FastifyInstance } from "fastify";
import { usuarios, Usuario, UsuarioResponse } from "../utils/auth";
import { v4 as uuidv4 } from "uuid";

export default async function usuarioRoutes(app: FastifyInstance) {
  // GET /api/usuarios
  app.get("/usuarios", async (_, reply) => {
    return reply.send(usuarios.map(({ senha, ...rest }) => rest)); // remove senha
  });

  // GET /api/usuario/:email
  app.get("/usuario/:email", async (request, reply) => {
    const { email } = request.params as { email: string };
    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    return reply.send({ ...usuario, senha: undefined }); // remove senha
  });

  // POST /api/usuario/registro
  app.post("/usuario/registro", async (request, reply) => {
    const data: UsuarioResponse = request.body as UsuarioResponse;

    const novoUsuario: Usuario = {
      ...data,
      id: usuarios.length + 1, // Simula um ID único
      token: uuidv4(), // Token será gerado no login
      telefone: "", // Telefone pode ser adicionado posteriormente
      nivelConsciencia: 1, // Nível de consciência inicial
      isMonitor: false, // Inicialmente não é monitor
      profilePhotoUrl: "", // URL da foto de perfil pode ser adicionada posteriormente
      posts: [], // Inicialmente sem posts
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
  app.post("/usuario/login", async (request, reply) => {
    const { email, senha } = request.body as { email: string; senha: string };

    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (!usuario) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    return reply.send({
      message: "Login bem-sucedido",
      id: usuario.id,
      email: usuario.email,
      token: usuario.token,
      nome: usuario.nome,
      telefone: usuario.telefone,
      nivelConsciencia: usuario.nivelConsciencia,
      isMonitor: usuario.isMonitor,
      profilePhotoUrl: usuario.profilePhotoUrl,
      posts: usuario.posts,
    });
  });
  // PUT /api/usuario/:email

  app.put("/usuario/alterar/:email", async (request, reply) => {
    const { email } = request.params as { email: string };
    const data: Partial<Usuario> = request.body as Partial<Usuario>;

    const usuarioIndex = usuarios.findIndex((u) => u.email === email);
    if (usuarioIndex === -1) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    const usuario = usuarios[usuarioIndex];

    // Atualiza os campos do usuário
    usuarios[usuarioIndex] = {
      ...usuario,
      ...data,
      // Mantém o ID e o token inalterados
      id: usuario.id,
      token: usuario.token,
    };
    return reply.send({
      message: "Usuário atualizado com sucesso",
      usuario: usuarios[usuarioIndex],
    });
  });
}
