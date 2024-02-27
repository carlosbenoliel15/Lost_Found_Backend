const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const authMiddleware = (req, res, next) => {
  // Obtenha o token de autorização do cabeçalho da requisição
  const token = req.header('Authorization');

  // Verifique se o token está presente
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {
    // Verifique se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next(); // Avance para o próximo middleware ou rota
  } catch (error) {
    res.status(401).json({ error: 'Token de autenticação inválido' });
  }
};

module.exports = authMiddleware;
