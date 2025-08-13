import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MenuDefault = ({ onLogout }) => {
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {}
  const isAdmin = user?.is_admin === 1;

  const handleLogout = () => {
    onLogout();
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#2b6cb0',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <div>
        <Link to="/home" style={linkStyle}>Home</Link>
        <Link to="/checklist" style={linkStyle}>Checklist</Link>
        {isAdmin && (
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/ambulancias" style={linkStyle}>Ambulâncias</Link>
          </>
        )}
      </div>
      <button onClick={handleLogout} style={logoutStyle}>Sair</button>
    </nav>
  );
};

const linkStyle = {
  color: 'white',
  marginRight: '1rem',
  textDecoration: 'none',
  fontWeight: 'bold'
};

const logoutStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default MenuDefault;
