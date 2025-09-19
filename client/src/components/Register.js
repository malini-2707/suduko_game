import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/modern-theme.css';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, loginWithGoogle } = useAuth();

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData.username, formData.password, formData.email);
    
    if (!result.success) {
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
            background: 'linear-gradient(135deg, var(--accent-color) 0%, #059669 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            ✨
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Join Sudoku Masters
          </h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
            Create your account and start solving puzzles
          </p>
        </div>
        
        <button 
          onClick={loginWithGoogle} 
          className="modern-btn modern-btn-secondary" 
          style={{width: '100%', marginBottom: '1.5rem'}}
        >
          <span style={{fontSize: '1.2rem'}}>🔍</span> 
          Sign up with Google
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
            or create with email
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
              placeholder="Choose a username"
              className="modern-input"
            />
          </div>

          <div className="modern-form-group">
            <label className="modern-label">Email (optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
                placeholder="Create a password"
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

          <div className="modern-form-group">
            <label className="modern-label">Confirm Password</label>
            <div style={{position: 'relative'}}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="modern-input"
                style={{paddingRight: '45px'}}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? '🙈' : '👁️'}
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div style={{textAlign: 'center'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>
            Already have an account?{' '}
            <button 
              onClick={onSwitchToLogin}
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
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
