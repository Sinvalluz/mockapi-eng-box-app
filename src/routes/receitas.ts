import { FastifyInstance } from "fastify";
import { readFile } from "fs/promises";
import path from "path";

export default async function receitasRoutes(app: FastifyInstance) {
  app.get("/", async (_, reply) => {
    try {
      const filePath = path.join(__dirname, "..", "..", "receitas.json");
      const data = await readFile(filePath, "utf-8");
      const receitas = JSON.parse(data);
      return reply.send(receitas);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Erro ao ler o arquivo de receitas." });
    }
  });
}
