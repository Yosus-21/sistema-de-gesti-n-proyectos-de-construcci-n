import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { httpClient } from '../../../shared/api/http-client';
import type { LoginRequest, User } from '../../../shared/types/auth.types';
import { Button, Input, Card } from '../../../shared/components';
import '../styles/auth.css';

export function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: LoginRequest = { correo, password };

      const response = await httpClient.post<{ accessToken: string; user: User }>(
        '/auth/login',
        payload,
      );
      login(response.accessToken, response.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-card">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}

        <Input
          label="Correo electrónico"
          name="correo"
          type="email"
          value={correo}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" loading={loading} className="login-submit-btn">
          Entrar
        </Button>
      </form>
    </Card>
  );
}
