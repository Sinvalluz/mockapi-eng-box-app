"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usuarioRoutes;
const auth_1 = require("../utils/auth");
const uuid_1 = require("uuid");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function usuarioRoutes(app) {
    // GET /api/usuarios
    app.get("/usuarios", async (_, reply) => {
        return reply.send(auth_1.usuarios.map(({ senha, ...rest }) => rest)); // remove senha
    });
    // GET /api/usuario/:email
    app.get("/usuario/:email", async (request, reply) => {
        const { email } = request.params;
        const usuario = auth_1.usuarios.find((u) => u.email === email);
        if (!usuario) {
            return reply.status(404).send({ error: "Usuário não encontrado" });
        }
        return reply.send({ ...usuario, senha: undefined }); // remove senha
    });
    // POST /api/usuario/registro
    app.post("/usuario/registro", async (request, reply) => {
        const data = request.body;
        const novoUsuario = {
            ...data,
            id: auth_1.usuarios.length + 1, // Simula um ID único
            token: (0, uuid_1.v4)(), // Token será gerado no login
            telefone: "", // Telefone pode ser adicionado posteriormente
            nivelConsciencia: 1, // Nível de consciência inicial
            isMonitor: false, // Inicialmente não é monitor
            profilePhotoUrl: "", // URL da foto de perfil pode ser adicionada posteriormente
            posts: [], // Inicialmente sem posts
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
    app.post("/usuario/login", async (request, reply) => {
        const { email, senha } = request.body;
        const usuario = auth_1.usuarios.find((u) => u.email === email && u.senha === senha);
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
        const { email } = request.params;
        const data = request.body;
        const usuarioIndex = auth_1.usuarios.findIndex((u) => u.email === email);
        if (usuarioIndex === -1) {
            return reply.status(404).send({ error: "Usuário não encontrado" });
        }
        const usuario = auth_1.usuarios[usuarioIndex];
        // Atualiza os campos do usuário
        auth_1.usuarios[usuarioIndex] = {
            ...usuario,
            ...data,
            // Mantém o ID e o token inalterados
            id: usuario.id,
            token: usuario.token,
        };
        return reply.send({
            message: "Usuário atualizado com sucesso",
            usuario: auth_1.usuarios[usuarioIndex],
        });
    });
    // POST /api/usuario/reset
    app.post("/usuario/reset", async (request, reply) => {
        const { email } = request.body;
        const usuario = auth_1.usuarios.find((u) => u.email === email);
        if (!usuario) {
            return reply.status(404).send({ error: "Usuário não encontrado" });
        }
        // Configuração do transporte do Nodemailer (exemplo com Gmail)
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS, // substitua pela sua senha ou app password
            },
        });
        // Conteúdo do email
        const mailOptions = {
            from: process.env.USER_EMAIL, // substitua pelo seu email
            to: email,
            subject: "Redefinição de Senha",
            text: `Olá, ${usuario.nome}! Seu token de verificação é: ${usuario.token}, use ele para alteração da senha e não compartilhe com ninguém.`,
        };
        try {
            console.log("Enviando email");
            await transporter.sendMail(mailOptions);
            console.log("Email de redefinição enviado com sucesso");
            return reply.send({
                message: "Email de redefinição enviado com sucesso",
            });
        }
        catch (error) {
            console.error("Erro ao enviar email:", error);
            return reply
                .status(500)
                .send({ error: "Erro ao enviar email de redefinição" });
        }
    });
    // PUT /api/usuario/reset
    app.put("/usuario/reset/:email", async (request, reply) => {
        const { email } = request.params;
        const { token, novaSenha } = request.body;
        const usuarioIndex = auth_1.usuarios.findIndex((u) => u.email === email && u.token === token);
        if (usuarioIndex === -1) {
            return reply.status(400).send({ error: "Email ou token inválido" });
        }
        auth_1.usuarios[usuarioIndex].senha = novaSenha;
        return reply.send({ message: "Senha alterada com sucesso" });
    });
    // PATCH /api/usuario/post/:email
    // POST /api/usuario/post/:email
    app.post("/usuario/post/:email", async (request, reply) => {
        const { email } = request.params;
        const data = request.body; // Recebe todos os dados do post
        const usuarioIndex = auth_1.usuarios.findIndex((u) => u.email === email);
        if (usuarioIndex === -1) {
            return reply.status(404).send({ error: "Usuário não encontrado" });
        }
        let newPost = {
            id: (0, uuid_1.v4)(),
            dataCriacao: new Date().toString(),
            titulo: data.titulo,
            tema: data.tema,
            subtemas: data.tema,
            conteudo: data.tema,
            fotos: [
                {
                    url: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 10) + 1}`,
                    name: "imagem",
                    type: "image/jpeg",
                },
            ],
        };
        // Adiciona o novo post ao array de posts do usuário
        if (auth_1.usuarios[usuarioIndex] && auth_1.usuarios[usuarioIndex].posts) {
            auth_1.usuarios[usuarioIndex].posts.push(newPost);
        }
        else {
            return reply
                .status(500)
                .send({ error: "Erro ao adicionar post ao usuário" });
        }
        return reply.send({
            message: "Post adicionado com sucesso",
            posts: auth_1.usuarios[usuarioIndex].posts,
        });
    });
}
