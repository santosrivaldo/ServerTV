import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header style={{
      backgroundColor: 'white',
      padding: '15px 20px',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: '250px',
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>
          Bem-vindo, {user?.username}!
        </h1>
        <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '14px' }}>
          {user?.region && `Região: ${user.region}`}
          {user?.sector && ` • Setor: ${user.sector}`}
          {user?.store && ` • Loja: ${user.store}`}
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          padding: '8px 12px',
          backgroundColor: user?.role === 'admin' ? '#e74c3c' : 
                          user?.role === 'manager' ? '#f39c12' : '#27ae60',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        }}>
          {user?.role === 'admin' ? 'ADMIN' : 
           user?.role === 'manager' ? 'GERENTE' : 'USUÁRIO'}
        </div>
      </div>
    </header>
  );
};
