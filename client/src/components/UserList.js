import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="card" style={{marginTop: '20px'}}>
      <h3 style={{marginBottom: '20px', color: '#333'}}>Registered Users</h3>
      
      {error && <div className="error">{error}</div>}
      
      <div style={{display: 'grid', gap: '10px'}}>
        {users.map(user => (
          <div 
            key={user.id} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}
          >
            {user.avatar && (
              <img 
                src={user.avatar} 
                alt={user.username}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
            
            <div style={{flex: 1}}>
              <div style={{fontWeight: '600', color: '#2d3748'}}>
                {user.username}
              </div>
              <div style={{fontSize: '12px', color: '#718096'}}>
                {user.email || 'No email'}
              </div>
              <div style={{fontSize: '12px', color: '#718096'}}>
                {user.provider === 'google' ? '🔍 Google' : '🔐 Local'} • {user.role}
              </div>
            </div>
            
            <div style={{fontSize: '12px', color: '#718096'}}>
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{marginTop: '15px', fontSize: '14px', color: '#718096'}}>
        Total users: {users.length}
      </div>
    </div>
  );
};

export default UserList;
