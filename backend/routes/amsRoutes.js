const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // assumindo que pool usa mysql2/promise

// Buscar todas as ambulâncias
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ambulancias');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar ambulâncias:', err);
    res.status(500).json({ erro: 'Erro ao buscar ambulâncias' });
  }
});

// Cadastrar nova ambulância
router.post('/', async (req, res) => {
  const { numero, placa } = req.body;

  if (!numero || !placa) {
    return res.status(400).json({ erro: 'Número e placa são obrigatórios' });
  }

  try {
    await pool.query(
      'INSERT INTO ambulancias (numero, placa, ativa) VALUES (?, ?, ?)',
      [numero, placa, true]
    );
    res.status(201).json({ mensagem: 'Ambulância cadastrada com sucesso' });
  } catch (err) {
    console.error('Erro ao cadastrar ambulância:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar ambulância' });
  }
});

module.exports = router;
