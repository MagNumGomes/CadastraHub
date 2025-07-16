const jwt = require('jsonwebtoken');
const prisma = require('../dbConnector');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }
    
    req.user = decoded; // Adiciona o usuário decodificado à requisição
    next(); // Passa para a próxima função (o controller)

  } catch (err) {
    // LOG DE ERRO DETALHADO AQUI
    console.error("ERRO NO MIDDLEWARE adminAuth:", err);

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token inválido ou sessão expirada.' });
    }

    return res.status(500).json({ error: 'Erro interno no servidor durante a autenticação.' });
  }
};