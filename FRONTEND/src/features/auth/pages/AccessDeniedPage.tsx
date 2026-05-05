import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--color-danger)' }}>403</h1>
      <h2>Acceso Denegado</h2>
      <p style={{ maxWidth: '400px', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
        Lo sentimos, no tienes los permisos necesarios para acceder a esta página. 
        Si crees que esto es un error, contacta al administrador.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="ghost" onClick={() => navigate(-1)}>Volver</Button>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>Ir al Dashboard</Button>
      </div>
    </div>
  );
}
