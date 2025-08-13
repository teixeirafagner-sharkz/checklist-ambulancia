const pool = require('../config/db'); // MySQL pool com mysql2/promise

// Criar checklist
exports.createChecklist = async (req, res) => {
  const { motorista, ambulancia_id, data_hora, observacoes } = req.body;
  const userId = req.user.id;

  try {
    // Insere usando foreign key para ambulância e usuário
    const [result] = await pool.query(
      'INSERT INTO checklists (motorista, ambulancia_id, user_id, data_hora, observacoes) VALUES (?, ?, ?, ?, ?)',
      [motorista, ambulancia_id, userId, data_hora, observacoes]
    );

    // Recupera o registro criado com dados relacionados
    const [[row]] = await pool.query(
      `SELECT
         c.id,
         c.motorista,
         a.numero   AS ambulancia_numero,
         a.placa    AS ambulancia_placa,
         c.data_hora,
         c.observacoes
       FROM checklists c
       JOIN ambulancias a ON c.ambulancia_id = a.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json(row);
  } catch (err) {
    console.error('Erro ao criar checklist:', err);
    res.status(500).json({ error: err.message });
  }
};

// Listar checklists do usuário logado
exports.getMyChecklists = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT
         c.id,
         c.motorista,
         a.numero   AS ambulancia_numero,
         a.placa    AS ambulancia_placa,
         c.data_hora,
         c.observacoes
       FROM checklists c
       JOIN ambulancias a ON c.ambulancia_id = a.id
       WHERE c.user_id = ?
       ORDER BY c.data_hora DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar checklists do usuário:', err);
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os checklists (admin)
exports.getAllChecklists = async (req, res) => {
  const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
  try {
    const [rows] = await pool.query(`
      SELECT
        c.id,
        u.nome        AS nome_usuario,
        c.motorista,
        a.placa       AS ambulancia_placa,
        c.data_hora,
        c.observacoes
      FROM checklists c
      JOIN users u         ON c.user_id = u.id
      JOIN ambulancias a   ON c.ambulancia_id = a.id
      ORDER BY c.data_hora ${order}
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar todos os checklists:', err);
    res.status(500).json({ error: err.message });
  }
};

