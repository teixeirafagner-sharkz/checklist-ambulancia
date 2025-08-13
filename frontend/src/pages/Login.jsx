import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';  // Alterado: importe o cliente axios configurado

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Alterado: uso de api.post em vez de fetch para chamadas dinâmicas
      const { data } = await api.post('/api/usuarios/login', { email, senha });

      console.log('Resposta da API:', data);
      if (data.token && data.user) {
        setMensagem('Login realizado com sucesso!');
        localStorage.setItem('token', data.token);  // mantém compatibilidade
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      } else {
        setMensagem(data.error || 'Erro no login');
        console.warn('Dados inválidos recebidos:', data);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMensagem('Erro de conexão com o servidor');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#e6f0fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#007BFF' }}>Login</h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />

          <label style={{ marginBottom: '0.5rem' }}>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{
              padding: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />

          <button
            type="submit"
            style={{
              padding: '0.75rem',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
        </form>

        {mensagem && (
          <p style={{ marginTop: '1rem', textAlign: 'center', color: data.token ? 'green' : 'red' }}>
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
