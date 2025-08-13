import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Checklist from './pages/Checklist';
import Dashboard from './pages/Dashboard';
import Ambulancias from './pages/Ambulancias';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/fagner">  {}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ambulancias" element={<Ambulancias />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
