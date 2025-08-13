import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuDefault from '../components/MenuDefault';
import api from '../api'; // ✅ Usa api com base dinâmica

const Dashboard = () => {
  const [checklists, setChecklists] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [view, setView] = useState('checklists');
  const [filtroMotorista, setFiltroMotorista] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [descendente, setDescendente] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      if (view === 'checklists') {
        carregarChecklists();
      } else {
        carregarUsuarios();
      }
    }
  }, [view, descendente]);

  const carregarChecklists = async () => {
    try {
      const res = await api.get(`/api/checklists/todos?order=${descendente ? 'desc' : 'asc'}`);
      setChecklists(res.data);
      setErro('');
    } catch (err) {
      console.error('Erro ao carregar checklists:', err);
      setErro('Erro ao carregar checklists.');
    }
  };

  const carregarUsuarios = async () => {
    try {
      const res = await api.get('/api/usuarios');
      setUsuarios(res.data);
      setErro('');
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setErro('Erro ao carregar usuários.');
    }
  };

  const editarUsuario = (u) => {
    setUsuarioEditando({ ...u });
    setModoEdicao(true);
    setMensagem('');
  };

  const cancelarEdicao = () => {
    setModoEdicao(false);
    setUsuarioEditando(null);
  };

  const salvarEdicao = async () => {
    try {
      await api.put(`/api/usuarios/${usuarioEditando.id}`, usuarioEditando);
      setMensagem('Usuário atualizado com sucesso.');
      setModoEdicao(false);
      carregarUsuarios();
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setMensagem('Erro ao atualizar usuário.');
    }
  };

  const toggleOrdenacao = () => setDescendente(!descendente);
  const filtrarMotorista = (e) => setFiltroMotorista(e.target.value);
  const novoUsuario = () => navigate('/cadastro');
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <MenuDefault onLogout={logout} />
      <h2 style={{ color: '#2b6cb0' }}>Painel Administrativo</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setView('checklists')}
          style={{
            marginRight: '1rem',
            padding: '0.5rem',
            backgroundColor: view === 'checklists' ? '#2b6cb0' : '#e2e8f0',
            color: view === 'checklists' ? 'white' : 'black'
          }}
        >
          Checklists
        </button>
        <button
          onClick={() => setView('usuarios')}
          style={{
            padding: '0.5rem',
            backgroundColor: view === 'usuarios' ? '#2b6cb0' : '#e2e8f0',
            color: view === 'usuarios' ? 'white' : 'black'
          }}
        >
          Usuários
        </button>
      </div>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}

      {view === 'checklists' && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              placeholder="Filtrar por motorista"
              value={filtroMotorista}
              onChange={filtrarMotorista}
              style={{ padding: '0.5rem', marginRight: '1rem' }}
            />
            <button onClick={toggleOrdenacao} style={{ padding: '0.5rem' }}>
              Ordenar: {descendente ? 'Mais recentes' : 'Mais antigos'}
            </button>
          </div>
          <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: '#ebf8ff' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Motorista</th>
                <th>Placa</th>
                <th>Data/Hora</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {checklists
                .filter(c => c.motorista.toLowerCase().includes(filtroMotorista.toLowerCase()))
                .map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.motorista}</td>
                    <td>{item.ambulancia_placa}</td>
                    <td>{new Date(item.data_hora).toLocaleString('pt-BR')}</td>
                    <td>{item.observacoes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      )}

      {view === 'usuarios' && (
        <section>
          <button
            onClick={novoUsuario}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#2b6cb0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Novo Usuário
          </button>
          <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: '#e6f0fa' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.is_admin ? 'Sim' : 'Não'}</td>
                  <td>
                    <button onClick={() => editarUsuario(u)} style={{ marginRight: '5px' }}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {modoEdicao && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                backgroundColor: '#f0f4f8'
              }}
            >
              <h4>Editar Usuário</h4>
              <label>Nome: </label>
              <input
                value={usuarioEditando.nome}
                onChange={e => setUsuarioEditando({ ...usuarioEditando, nome: e.target.value })}
              />
              <br />
              <label>Email: </label>
              <input
                value={usuarioEditando.email}
                onChange={e => setUsuarioEditando({ ...usuarioEditando, email: e.target.value })}
              />
              <br />
              <label>Admin: </label>
              <select
                value={usuarioEditando.is_admin}
                onChange={e =>
                  setUsuarioEditando({
                    ...usuarioEditando,
                    is_admin: e.target.value === '1' ? 1 : 0
                  })
                }
              >
                <option value="0">Não</option>
                <option value="1">Sim</option>
              </select>
              <br />
              <button onClick={salvarEdicao} style={{ marginTop: '0.5rem', marginRight: '0.5rem' }}>
                Salvar
              </button>
              <button onClick={cancelarEdicao}>Cancelar</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
