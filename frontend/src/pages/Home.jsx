import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuDefault from '../components/MenuDefault';

const Home = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    console.error('Erro ao ler usuário do localStorage:', e);
  }

  useEffect(() => {
    if (!user) {
      console.warn('Usuário não autenticado. Redirecionando...');
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  const isAdmin = Boolean(user?.is_admin);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <MenuDefault onLogout={handleLogout} />
      <h2 style={{ color: '#2b6cb0' }}>Bem-vindo, {user?.nome}</h2>

      {/* Se desejar exibir opções de admin, pode usar: */}
      {isAdmin && (
        <p style={{ color: '#2b6cb0', marginTop: '1rem' }}>
          Você está logado como administrador.
        </p>
      )}
    </div>
  );
};

export default Home;
