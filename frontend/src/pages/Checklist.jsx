import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuDefault from '../components/MenuDefault';
import api from '../api'; // ✅ usa api com base dinâmica para produção

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/usuarios/cadastro', {
        nome,
        email,
        senha,
        is_admin: isAdmin
      });

      if (response.status === 201 || response.status === 200) {
        setMensagem('Usuário cadastrado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
        setIsAdmin(false);
      } else {
        setMensagem(response.data.error || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setMensagem('Erro na requisição.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <MenuDefault onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }} />

      <h2 style={{ color: '#2b6cb0' }}>Cadastro de Usuário</h2>

      <form
        onSubmit={handleCadastro}
        style={{
          backgroundColor: '#f0f4f8',
          padding: '1rem',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: '0 auto'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <label>Nome:</label><br />
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Senha:</label><br />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>É administrador?</label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2b6cb0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          Cadastrar
        </button>
      </form>

      {mensagem && (
        <p
          style={{
            marginTop: '1rem',
            color: mensagem.includes('sucesso') ? 'green' : 'red',
            textAlign: 'center'
          }}
        >
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default Cadastro;
