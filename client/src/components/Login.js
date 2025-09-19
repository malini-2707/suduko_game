import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/modern-theme.css';

const Login = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      window.location.href = '/game';
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="modern-card fade-in" style={{width: '100%', maxWidth: '420px'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            🧩
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
            Sign in to continue your Sudoku journey
          </p>
        </div>
        
        <button 
          onClick={loginWithGoogle} 
          className="modern-btn modern-btn-secondary" 
          style={{width: '100%', marginBottom: '1.5rem'}}
        >
          <span style={{fontSize: '1.2rem'}}>🔍</span> 
          Continue with Google
        </button>

        <div style={{
          textAlign: 'center', 
          margin: '1.5rem 0', 
          position: 'relative'
        }}>
          <div style={{
            height: '1px',
            background: 'rgba(100, 116, 139, 0.3)',
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0'
          }}></div>
          <span style={{
            background: 'var(--bg-secondary)',
            padding: '0 1rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            position: 'relative'
          }}>
            or continue with email
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modern-form-group">
            <label className="modern-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="modern-input"
            />
          </div>
          
          <div className="modern-form-group">
            <label className="modern-label">Password</label>
            <div style={{position: 'relative'}}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="modern-input"
                style={{paddingRight: '45px'}}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-md)',
              color: 'var(--danger-color)',
              fontSize: '0.875rem',
              marginBottom: 'var(--spacing-lg)'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="modern-btn modern-btn-primary" 
            disabled={loading} 
            style={{width: '100%', marginBottom: '1.5rem'}}
          >
            {loading ? (
              <>
                <div className="loading-spinner" style={{width: '16px', height: '16px'}}></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div style={{textAlign: 'center'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>
            Don't have an account?{' '}
            <button 
              onClick={onSwitchToSignup}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                textDecoration: 'underline'
              }}
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
