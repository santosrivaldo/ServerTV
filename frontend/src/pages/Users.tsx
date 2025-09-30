import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userService, User } from '../services/userService';
import { toast } from 'react-toastify';
import { Plus, Search, User, Edit, Trash2, Shield, MapPin, Building, Store } from 'lucide-react';

export const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery(
    'users',
    userService.getUsers
  );

  const deleteUserMutation = useMutation(
    (id: number) => userService.deleteUser(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('Usuário removido com sucesso!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Erro ao remover usuário');
      },
    }
  );

  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.sector?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.store?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      manager: 'Gerente',
      user: 'Usuário'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: '#e74c3c',
      manager: '#f39c12',
      user: '#27ae60'
    };
    return colors[role as keyof typeof colors] || '#7f8c8d';
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div>Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>
          Usuários ({filteredUsers.length})
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          Novo Usuário
        </button>
      </div>

      {/* Barra de busca */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={20} style={{ color: '#7f8c8d' }} />
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ flex: 1, margin: 0 }}
          />
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                  Usuário
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                  Papel
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                  Localização
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                  Status
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        {user.username}
                      </div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: getRoleColor(user.role),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      {user.region && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                          <MapPin size={12} />
                          {user.region}
                        </div>
                      )}
                      {user.sector && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                          <Building size={12} />
                          {user.sector}
                        </div>
                      )}
                      {user.store && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Store size={12} />
                          {user.store}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: user.is_active ? '#d4edda' : '#f8d7da',
                      color: user.is_active ? '#155724' : '#721c24',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {user.is_active ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteUserMutation.mutate(user.id)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <User size={48} style={{ color: '#7f8c8d', marginBottom: '15px' }} />
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>
            Nenhum usuário encontrado
          </h3>
          <p style={{ color: '#7f8c8d' }}>
            {searchQuery ? 'Tente ajustar sua busca' : 'Adicione seu primeiro usuário'}
          </p>
        </div>
      )}
    </div>
  );
};
