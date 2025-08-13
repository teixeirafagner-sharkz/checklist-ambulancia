const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  console.log('Token recebido no header:', token);
  if (!token) return res.status(403).json({ msg: 'Token não fornecido' });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET não definida!');
      return res.status(500).json({ msg: 'Erro interno: chave secreta não configurada' });
    }

    const tokenSemBearer = token.split(' ')[1]; // Remove o "Bearer"
    const decoded = jwt.verify(tokenSemBearer, secret);

    console.log('Token decodificado:', decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    res.status(401).json({ msg: 'Token inválido' });
  }
}

function isAdmin(req, res, next) {
  if (!req.user.is_admin) {
    return res.status(403).json({ msg: 'Acesso negado: apenas administradores' });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
