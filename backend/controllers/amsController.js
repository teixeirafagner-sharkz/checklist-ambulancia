const db = require('../config/db'); // Ajuste conforme seu setup

// Buscar todas as ambulâncias
const listarAmbulancias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ambulancias');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar ambulâncias:', error);
    res.status(500).json({ error: 'Erro ao buscar ambulâncias' });
  }
};

// Criar nova ambulância
const criarAmbulancia = async (req, res) => {
  const { numero, descricao } = req.body;
  if (!numero) return res.status(400).json({ error: 'Número é obrigatório' });

  try {
    const [result] = await db.query('INSERT INTO ambulancias (numero, descricao) VALUES (?, ?)', [numero, descricao]);
    res.status(201).json({ message: 'Ambulância cadastrada com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar ambulância:', error);
    res.status(500).json({ error: 'Erro ao cadastrar ambulância' });
  }
};

// Editar ambulância
const editarAmbulancia = async (req, res) => {
  const { id } = req.params;
  const { numero, descricao } = req.body;

  try {
    const [result] = await db.query('UPDATE ambulancias SET numero = ?, descricao = ? WHERE id = ?', [numero, descricao, id]);
    res.status(200).json({ message: 'Ambulância atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao editar ambulância:', error);
    res.status(500).json({ error: 'Erro ao atualizar ambulância' });
  }
};

module.exports = {
  listarAmbulancias,
  criarAmbulancia,
  editarAmbulancia
};
