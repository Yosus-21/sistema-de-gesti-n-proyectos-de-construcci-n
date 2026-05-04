import React, { useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, contrasena: password });
    } catch (err: unknown) {
      setError((err as Error).message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#ffebee', borderRadius: '4px' }}>{error}</div>}
      
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.3rem' }}>Correo Electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.3rem' }}>Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '0.75rem', 
          backgroundColor: 'var(--color-primary)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 500
        }}
      >
        {loading ? 'Iniciando sesión...' : 'Ingresar'}
      </button>
    </form>
  );
};
