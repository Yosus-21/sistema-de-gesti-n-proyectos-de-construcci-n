import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components';

export function NotFoundPage() {
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
      <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--color-primary)' }}>404</h1>
      <h2>Página no encontrada</h2>
      <p style={{ maxWidth: '400px', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
        La página que estás buscando no existe o ha sido movida.
      </p>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>Ir al Dashboard</Button>
    </div>
  );
}
