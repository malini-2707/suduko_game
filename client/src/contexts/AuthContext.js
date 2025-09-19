import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios for credentials
  axios.defaults.withCredentials = true;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/user');
      setUser(response.data.user);
    } catch (error) {
      // User not authenticated
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/login', { username, password });
      
      // Handle both JWT and session-based responses
      if (response.data.token) {
        // JWT-based response
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
      } else if (response.data.user) {
        // Session-based response
        setUser(response.data.user);
      } else {
        // Check if user is authenticated via session
        await checkAuthStatus();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, password, email) => {
    try {
      const response = await axios.post('/api/register', { username, password, email });
      
      // Check if response contains token (JWT) or user (session-based)
      if (response.data.token) {
        // JWT-based response
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
      } else if (response.data.user) {
        // Session-based response
        setUser(response.data.user);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      // Clear any stored tokens
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if server request fails
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loginWithGoogle,
    loading,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
