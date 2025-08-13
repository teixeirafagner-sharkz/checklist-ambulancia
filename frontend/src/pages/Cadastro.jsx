import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuDefault from '../components/MenuDefault'; // importa o menu padrão

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
      const response = await fetch('http://localhost:5000/api/usuarios/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha, is_admin: isAdmin })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Usuário cadastrado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
        setIsAdmin(false);
      } else {
        setMensagem(data.error || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setMensagem('Erro na requisição.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      {/* Menu padrão com botão de logout incluso */}
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
          maxWidth: '400px'
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
            borderRadius: '4px'
          }}
        >
          Cadastrar
        </button>
      </form>

      {mensagem && (
        <p
          style={{
            marginTop: '1rem',
            color: mensagem.includes('sucesso') ? 'green' : 'red'
          }}
        >
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default Cadastro;
