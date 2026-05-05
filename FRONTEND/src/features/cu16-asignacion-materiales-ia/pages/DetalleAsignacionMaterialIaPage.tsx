import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { useAsignacionesMaterialIa } from '../hooks/useAsignacionesMaterialIa';
import { AsignacionMaterialIaDetailCard } from '../components/AsignacionMaterialIaDetailCard';
import '../styles/asignacion-materiales-ia.css';

export function DetalleAsignacionMaterialIaPage() {
  const { idAsignacionMaterial } = useParams();
  const navigate = useNavigate();
  const { asignaciones, loading } = useAsignacionesMaterialIa();
  
  const id = Number(idAsignacionMaterial);
  const asignacion = asignaciones.find(a => a.idAsignacionMaterial === id);

  if (loading) return <Loader />;

  return (
    <div className="ia-page">
      <div className="page-header">
        <h1>Detalle de Asignación IA #{id}</h1>
        <Button variant="ghost" onClick={() => navigate('/ia/asignacion-materiales')}>Volver</Button>
      </div>

      {asignacion ? (
        <AsignacionMaterialIaDetailCard asignacion={asignacion} />
      ) : (
        <Card>
          <div className="info-banner">
            <p><strong>Nota:</strong> No se encontró la asignación en la lista actual o el backend no provee un endpoint de consulta individual directo. Por favor, regrese al listado general.</p>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button variant="primary" onClick={() => navigate('/ia/asignacion-materiales')}>Ir al Listado</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
