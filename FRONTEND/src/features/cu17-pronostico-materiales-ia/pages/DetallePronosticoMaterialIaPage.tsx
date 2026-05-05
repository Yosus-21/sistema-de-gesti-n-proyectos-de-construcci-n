import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { usePronosticosMaterialIa } from '../hooks/usePronosticosMaterialIa';
import { PronosticoMaterialIaDetailCard } from '../components/PronosticoMaterialIaDetailCard';
import '../styles/pronostico-materiales-ia.css';

export function DetallePronosticoMaterialIaPage() {
  const { idPronosticoMaterial } = useParams();
  const navigate = useNavigate();
  const { pronosticos, loading } = usePronosticosMaterialIa();
  
  const id = Number(idPronosticoMaterial);
  const pronostico = pronosticos.find(p => p.idPronosticoMaterial === id);

  if (loading) return <Loader />;

  return (
    <div className="ia-page">
      <div className="page-header">
        <h1>Detalle de Pronóstico IA #{id}</h1>
        <Button variant="ghost" onClick={() => navigate('/ia/pronostico-materiales')}>Volver</Button>
      </div>

      {pronostico ? (
        <PronosticoMaterialIaDetailCard pronostico={pronostico} />
      ) : (
        <Card>
          <div className="info-banner">
            <p><strong>Nota:</strong> No se encontró el pronóstico en la lista actual o el backend no provee un endpoint de consulta individual directo.</p>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button variant="primary" onClick={() => navigate('/ia/pronostico-materiales')}>Ir al Listado</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
