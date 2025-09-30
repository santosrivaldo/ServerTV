import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Video, 
  List, 
  Users, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/videos', label: 'Vídeos', icon: Video },
    { path: '/playlists', label: 'Playlists', icon: List },
    { path: '/users', label: 'Usuários', icon: Users },
    { path: '/stats', label: 'Estatísticas', icon: BarChart3 },
  ];

  return (
    <div style={{
      width: '250px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
          ServerTV
        </h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
          Sistema de Streaming
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive ? '#34495e' : 'transparent',
              borderLeft: isActive ? '3px solid #3498db' : '3px solid transparent',
              transition: 'all 0.2s ease',
            })}
          >
            <item.icon size={18} style={{ marginRight: '10px' }} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid #34495e' }}>
        <div style={{ marginBottom: '10px', fontSize: '14px' }}>
          <div style={{ fontWeight: 'bold' }}>{user?.username}</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {user?.role === 'admin' ? 'Administrador' : 
             user?.role === 'manager' ? 'Gerente' : 'Usuário'}
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: '1px solid #e74c3c',
            color: '#e74c3c',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={16} style={{ marginRight: '8px' }} />
          Sair
        </button>
      </div>
    </div>
  );
};
