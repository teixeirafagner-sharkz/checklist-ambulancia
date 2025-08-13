// Atualização limpa e organizada para a página Ambulancias.jsx
// Inclui API dinâmica, uso seguro de URL, feedbacks claros e compatibilidade em produção

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MenuDefault from '../components/MenuDefault';
import api from '../api'; // ✅ usa instância axios com URL dinâmica

const Ambulancias = () => {
  const [ambulancias, setAmbulancias] = useState([]);
  const [view, setView] = useState('lista');
  const [form, setForm] = useState({ numero: '', placa: '' });
  const [mensagem, setMensagem] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [ambulanciaEditando, setAmbulanciaEditando] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    carregarAmbulancias();
  }, []);

  const carregarAmbulancias = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/ambulancias', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAmbulancias(res.data);
    } catch (err) {
      console.error('Erro ao buscar ambulâncias:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.numero || !form.placa) {
      setMensagem('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (modoEdicao) {
        await api.put(`/api/ambulancias/${ambulanciaEditando.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensagem('Ambulância atualizada com sucesso!');
      } else {
        await api.post('/api/ambulancias', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensagem('Ambulância cadastrada com sucesso!');
      }
      setForm({ numero: '', placa: '' });
      setModoEdicao(false);
      setAmbulanciaEditando(null);
      setView('lista');
      carregarAmbulancias();
    } catch (err) {
      console.error('Erro ao salvar ambulância:', err);
      setMensagem('Erro ao salvar ambulância.');
    }
  };

  const novoCadastro = () => {
    setModoEdicao(false);
    setForm({ numero: '', placa: '' });
    setAmbulanciaEditando(null);
    setView('form');
    setMensagem('');
  };

  const editarAmbulancia = amb => {
    setModoEdicao(true);
    setAmbulanciaEditando(amb);
    setForm({ numero: amb.numero, placa: amb.placa });
    setView('form');
    setMensagem('');
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <MenuDefault onLogout={logout} />
      <h2 style={{ color: '#2b6cb0' }}>Ambulâncias</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setView('lista')}
          style={{
            marginRight: '1rem',
            padding: '0.5rem',
            backgroundColor: view === 'lista' ? '#2b6cb0' : '#e2e8f0',
            color: view === 'lista' ? 'white' : 'black'
          }}
        >
          Lista
        </button>
        <button
          onClick={novoCadastro}
          style={{
            padding: '0.5rem',
            backgroundColor: view === 'form' ? '#2b6cb0' : '#e2e8f0',
            color: view === 'form' ? 'white' : 'black'
          }}
        >
          {modoEdicao ? 'Editar' : 'Novo'}
        </button>
      </div>

      {mensagem && <p style={{ color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}

      {view === 'lista' && (
        <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: '#e6f0fa' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Placa</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ambulancias.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.numero}</td>
                <td>{a.placa}</td>
                <td>{a.ativa ? 'Ativa' : 'Inativa'}</td>
                <td>
                  <button onClick={() => editarAmbulancia(a)} style={{ marginRight: '5px' }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {view === 'form' && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '500px', margin: '1rem auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <label style={{ margin: '0.5rem 0 0.25rem' }}>Número*</label>
          <input
            name="numero"
            value={form.numero}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <label style={{ margin: '0.5rem 0 0.25rem' }}>Placa*</label>
          <input
            name="placa"
            value={form.placa}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Salvar
          </button>
        </form>
      )}
    </div>
  );
};

export default Ambulancias;
