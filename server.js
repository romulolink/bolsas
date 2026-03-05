require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// 1. Definição do Schema
const VagaSchema = new mongoose.Schema({
    titulo: String,
    observaca: String,
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

// 2. Função de Setup Inicial
const setupDatabase = async () => {
    try {
        const count = await Vaga.countDocuments({ numeroVaga: "03" });
        
        if (count === 0) {
            await Vaga.create({
                numeroVaga: "03",
                formacao: "Cursando: Engenharia química, Engenharia Aeroespacial ou áreas correlatas",
                conhecimento: [
                    "Tema: Propelentes sólidos compósitos",
                    "Familiaridade com laboratório de química",
                    "Manipulação de vidrarias",
                    "Procedimentos experimentais",
                    "Desejável: inglês"
                ],
                experiencia: "Aluno de nível superior com experiência em atividades de pesquisa, desenvolvimento ou inovação",
                modalidade: "SET I",
                valor: 1040.00,
                dataLancamento: new Date("2026-03-02"),
                dataEncerramento: null
            });
            console.log("✅ Setup: Vaga 03 do Projeto MATEP inserida com sucesso.");
        } else {
            console.log("ℹ️ Setup: Base de dados já contém a vaga 03.");
        }
    } catch (err) {
        console.error("❌ Erro no setup:", err);
    }
};

// 3. Conexão MongoDB e Start do Servidor
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("📡 Conectado ao MongoDB Atlas");
        setupDatabase(); // Executa o setup inicial
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
    })
    .catch(err => console.error("Erro ao conectar no MongoDB:", err));