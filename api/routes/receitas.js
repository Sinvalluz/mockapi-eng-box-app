"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = receitasRoutes;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
async function receitasRoutes(app) {
    app.get("/", async (_, reply) => {
        try {
            const filePath = path_1.default.join(__dirname, "..", "..", "public", "receitas.json");
            const data = await (0, promises_1.readFile)(filePath, "utf-8");
            const receitas = JSON.parse(data);
            return reply.send(receitas);
        }
        catch (error) {
            return reply
                .status(500)
                .send({ error: "Erro ao ler o arquivo de receitas." });
        }
    });
}
