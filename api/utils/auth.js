"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarios = void 0;
exports.carregarUsuarios = carregarUsuarios;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
// Armazenamento simulado
exports.usuarios = [];
// Função para carregar usuários do arquivo JSON
async function carregarUsuarios() {
    const filePath = path_1.default.join(__dirname, "..", "..", "usuarios.json");
    const data = await (0, promises_1.readFile)(filePath, "utf-8");
    exports.usuarios = JSON.parse(data);
}
