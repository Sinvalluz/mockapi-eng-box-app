import Fastify from "fastify";
import jwt from "fastify-jwt";
import usuarioRoutes from "./routes/usuario";
import receitasRoutes from "./routes/receitas";
import { carregarUsuarios } from "./utils/auth";

const app = Fastify();

app.register(jwt, {
  secret: "supersecret", // Troque por variável de ambiente em produção
});

app.register(usuarioRoutes, { prefix: "/api/usuario" });
app.register(receitasRoutes, { prefix: "/api/receitas" });
app.get("/", async (_, reply) => {
  return reply.send({ message: "API is running" });
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    carregarUsuarios();
    console.log("🚀 Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
