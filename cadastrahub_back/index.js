require('dotenv').config();
const express = require('express');
// A biblioteca 'cors' não será mais usada nesta abordagem
// const cors = require('cors'); 
const mainRoutes = require('./src/routes/routes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// --- INÍCIO DA MUDANÇA: Middleware de CORS Manual ---

// Este middleware será executado em TODAS as requisições
app.use((req, res, next) => {
  // Define qual origem (frontend) tem permissão de acesso
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

  // Define quais métodos HTTP são permitidos
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Define quais cabeçalhos o frontend pode enviar
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // A requisição OPTIONS (preflight) é especial. Se o método for OPTIONS,
  // nós apenas respondemos com 'OK' (status 204) e encerramos a requisição aqui.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  // Se não for uma requisição OPTIONS, continua para as próximas rotas.
  next();
});

// --- FIM DA MUDANÇA ---


// Middleware para interpretar o corpo das requisições como JSON.
app.use(express.json());


// --- SUAS ROTAS (permanecem as mesmas) ---
app.use('/api', mainRoutes);
app.use('/api/admin', adminRoutes);


// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));