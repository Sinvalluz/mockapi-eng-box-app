import Fastify from "fastify";
import jwt from "fastify-jwt";
import usuarioRoutes from "./routes/usuario";

const app = Fastify();

app.register(jwt, {
  secret: "supersecret", // Troque por variável de ambiente em produção
});

app.register(usuarioRoutes, { prefix: "/api/usuario" });

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("🚀 Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
