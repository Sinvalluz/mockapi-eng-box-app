"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const usuarios_1 = __importDefault(require("./routes/usuarios"));
const auth_1 = require("./utils/auth");
const app = (0, fastify_1.default)();
app.register(usuarios_1.default, { prefix: "/api" });
// app.register(receitasRoutes, { prefix: "/api/receitas" });
app.get("/", async (_, reply) => {
    return reply.send({ message: "API is running" });
});
const start = async () => {
    try {
        await app.listen({ port: 3000, host: "0.0.0.0" });
        (0, auth_1.carregarUsuarios)();
        console.log("🚀 Server running on http://localhost:3000");
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
