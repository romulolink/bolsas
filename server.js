require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// 1. Definição do Schema (mantido conforme sua última versão)
const VagaSchema = new mongoose.Schema({
    titulo: String,
    observacao: String,
    numeroVaga: String,
    formacao: String,
    conhecimento: [String],
    experiencia: String,
    modalidade: String,
    valor: String,
    dataLancamento: String,
    dataEncerramento: String,
    created_at: String,
});

const Vaga = mongoose.model('Vaga', VagaSchema);

// 2. Rota Raiz para confirmação visual
app.get('/', (req, res) => {
    res.status(200).send({
        status: "Online",
        mensagem: "API do Projeto MATEP conectada com sucesso!",
        database: mongoose.connection.readyState === 1 ? "Conectado" : "Desconectado"
    });
});

// 3. Função de Setup
const setupDatabase = async () => {
    try {
        const existeVaga = await Vaga.findOne({ numeroVaga: "03" });
        if (!existeVaga) {
            await Vaga.create({
                titulo: "Perfis das Bolsas FINEP – Projeto MATEP",
                observacao: "são 03 três vagas SET-I disponíveis",
                numeroVaga: "03",
                formacao: "Cursando: Engenharia química, Engenharia Aeroespacial ou áreas correlatas",
                conhecimento: ["Tema: Propelentes sólidos compósitos", "Laboratório de química", "Inglês desejável"],
                experiencia: "Aluno de nível superior em PD&I",
                modalidade: "SET I",
                valor: "R$ 1.040,00",
                dataLancamento: "02/03/2026",
                dataEncerramento: "",
                created_at: new Date().toISOString()
            });
            return "Setup realizado com sucesso.";
        }
        return "Banco já inicializado.";
    } catch (err) {
        return "Erro no setup: " + err.message;
    }
};

// 4. Conexão e Exportação para Vercel
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("📡 MongoDB Conectado");
        await setupDatabase();
    })
    .catch(err => console.error("Erro MongoDB:", err));

// Necessário para a Vercel tratar o Express
module.exports = app;

// O app.listen continua para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server on: http://localhost:${PORT}`));
}