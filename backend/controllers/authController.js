const pool = require('../config/db'); // MySQL pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nome, email, senha, is_admin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const [result] = await pool.query(
      'INSERT INTO users (nome, email, senha, is_admin) VALUES (?, ?, ?, ?)',
      [nome, email, hashedPassword, is_admin || false]
    );
    res.status(201).json({ msg: 'Usuário registrado', user: { id: result.insertId, nome, email, is_admin } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) return res.status(401).json({ msg: 'Credenciais inválidas' });

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(401).json({ msg: 'Credenciais inválidas' });

    // Agora incluindo o nome no token
    const token = jwt.sign(
      {
        id: user.id,
        nome: user.nome, // <- ESSENCIAL para preencher automaticamente no frontend
        is_admin: user.is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        is_admin: user.is_admin
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
