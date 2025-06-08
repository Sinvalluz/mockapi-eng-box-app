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
            fotoUsu: data.fotoUsu,
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
        console.log(usuario);
        return reply.send({
            message: "Login bem-sucedido",
            email: usuario.email,
            token: usuario.token,
        });
    });
    // GET /api/usuario
    app.get("/", async (_, reply) => {
        return reply.send(auth_1.usuarios.map(({ senha, ...rest }) => rest)); // remove senha
    });
}
