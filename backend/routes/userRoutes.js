const express = require('express');
const router = express.Router();

const {
  cadastrarUsuario,
  login,
  listarUsuarios,
  atualizarUsuario,
  excluirUsuario
} = require('../controllers/userController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/cadastro', cadastrarUsuario);
router.post('/login', login);

// Rotas protegidas
router.get('/', verifyToken, isAdmin, listarUsuarios);
router.put('/:id', verifyToken, isAdmin, atualizarUsuario);
router.delete('/:id', verifyToken, isAdmin, excluirUsuario)
module.exports = router;
