require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors');

// Importação das rotas
const userRoutes = require('./routes/userRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const amsRoutes = require('./routes/amsRoutes'); // Rotas para gestão de ambulâncias

const app = express();

// Middleware para habilitar CORS – útil em ambiente de desenvolvimento
app.use(cors());

// Middleware para permitir envio de JSON no body das requisições
app.use(express.json());

// Definição das rotas da API
app.use('/api/usuarios', userRoutes); // Endpoints: login, cadastro, etc.
app.use('/api/checklists', checklistRoutes); // Endpoints: envio de checklist
app.use('/api/ambulancias', amsRoutes); // Endpoints: CRUD de ambulâncias

// Porta configurável via .env, com fallback para 5000
const PORT = process.env.PORT || 5000;

// Inicialização do servidor com log informativo
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
