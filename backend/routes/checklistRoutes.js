const express = require('express');
const router = express.Router();
const {
  createChecklist,
  getMyChecklists,
  getAllChecklists
} = require('../controllers/checklistController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Checklist padrão para usuários
router.post('/', verifyToken, createChecklist);
router.get('/meus', verifyToken, getMyChecklists);

// Checklist total para administradores
router.get('/todos', verifyToken, isAdmin, getAllChecklists);


module.exports = router;
