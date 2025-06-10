import Fastify from "fastify";
import usuarioRoutes from "./routes/usuarios";
import { carregarUsuarios } from "./utils/auth";

const app = Fastify();

app.register(usuarioRoutes, { prefix: "/api" });
// app.register(receitasRoutes, { prefix: "/api/receitas" });
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
