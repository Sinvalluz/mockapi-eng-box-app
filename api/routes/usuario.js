"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usuarioRoutes;
const auth_1 = require("../utils/auth");
async function usuarioRoutes(app) {
    // POST /api/usuario
    app.post("/", async (request, reply) => {
        const data = request.body;
        const novoUsuario = {
            nome: data.nome,
            senha: data.senha,
            email: data.email,
            telefone: data.telefone,
            nivelConsciencia: data.nivelConsciencia,
            isMonitor: data.isMonitor,
            profilePhotoUrl: data.profilePhotoUrl,
            token: data.token,
        };
        // Verifica se o email já está cadastrado
        const emailExistente = auth_1.usuarios.find((u) => u.email === novoUsuario.email);
        if (emailExistente) {
            return reply.status(400).send({ error: "Email já cadastrado" });
        }
        // Adiciona o novo usuário
        auth_1.usuarios.push(novoUsuario);
        return reply.send({
            message: "Usuário criado com sucesso",
        });
    });
    // POST /api/usuario/login
    app.post("/login", async (request, reply) => {
        const { email, senha } = request.body;
        const usuario = auth_1.usuarios.find((u) => u.email === email && u.senha === senha);
        if (!usuario) {
            return reply.status(401).send({ error: "Credenciais inválidas" });
        }
        return reply.send({
            message: "Login bem-sucedido",
            email: usuario.email,
            nome: usuario.nome,
            telefone: usuario.telefone,
            nivelConsciencia: usuario.nivelConsciencia,
            isMonitor: usuario.isMonitor,
            profilePhotoUrl: usuario.profilePhotoUrl,
            token: usuario.token,
        });
    });
    // GET /api/usuario
    app.get("/", async (_, reply) => {
        return reply.send(auth_1.usuarios.map(({ senha, ...rest }) => rest)); // remove senha
    });
    app.get("/:email", async (request, reply) => {
        const { email } = request.params;
        const usuario = auth_1.usuarios.find((u) => u.email === email);
        if (!usuario) {
            return reply.status(404).send({ error: "Usuário não encontrado" });
        }
        return reply.send({
            email: usuario.email,
            nome: usuario.nome,
            telefone: usuario.telefone,
            nivelConsciencia: usuario.nivelConsciencia,
            isMonitor: usuario.isMonitor,
            profilePhotoUrl: usuario.profilePhotoUrl,
        });
    });
    // put /api/usuario/:email
    app.put("/:email", async (request, reply) => {
        const { email } = request.params;
        const { nivelConsciencia } = request.body;
        // Encontra o usuário pelo email
        const usuarioIndex = auth_1.usuarios.findIndex((u) => u.email === email);
        if (usuarioIndex === -1) {
            return reply.status(404).send({ error: "Usuário não encontrado" });
        }
        // Atualiza o nível de consciência
        auth_1.usuarios[usuarioIndex] = {
            ...auth_1.usuarios[usuarioIndex],
            nivelConsciencia: nivelConsciencia,
        };
        return reply.send({
            message: "Nível de consciência atualizado com sucesso",
            usuario: {
                email: auth_1.usuarios[usuarioIndex].email,
                nivelConsciencia: auth_1.usuarios[usuarioIndex].nivelConsciencia,
            },
        });
    });
}
