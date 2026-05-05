import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionesMaterialIa } from '../hooks/useAsignacionesMaterialIa';
import { AsignacionesMaterialIaTable } from '../components/AsignacionesMaterialIaTable';
import { AsignacionMaterialIaFilters } from '../components/AsignacionMaterialIaFilters';
import { AjustarAsignacionMaterialDialog } from '../components/AjustarAsignacionMaterialDialog';
import { ConfirmarAsignacionMaterialDialog } from '../components/ConfirmarAsignacionMaterialDialog';
import { ValidarRestriccionesAsignacionMaterialDialog } from '../components/ValidarRestriccionesAsignacionMaterialDialog';
import type { AsignacionMaterialIa } from '../types/asignacion-material-ia.types';
import '../styles/asignacion-materiales-ia.css';

export function AsignacionesMaterialIaPage() {
  const navigate = useNavigate();
  const { asignaciones, loading, error, refetch, updateParams } = useAsignacionesMaterialIa();
  
  const [selectedAsignacion, setSelectedAsignacion] = useState<AsignacionMaterialIa | null>(null);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showValidate, setShowValidate] = useState(false);

  const handleAdjust = (id: number) => {
    const item = asignaciones.find(a => a.idAsignacionMaterial === id);
    if (item) {
      setSelectedAsignacion(item);
      setShowAdjust(true);
    }
  };

  const handleConfirm = (id: number) => {
    const item = asignaciones.find(a => a.idAsignacionMaterial === id);
    if (item) {
      setSelectedAsignacion(item);
      setShowConfirm(true);
    }
  };

  const handleValidate = (item: AsignacionMaterialIa) => {
    setSelectedAsignacion(item);
    setShowValidate(true);
  };

  return (
    <div className="ia-page">
      <div className="page-header">
        <div>
          <h1>Asignación Eficiente de Materiales (IA)</h1>
          <p className="page-subtitle">Optimización de asignación de recursos basada en Gemini AI y heurística.</p>
        </div>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => setShowValidate(true)}>Validar Restricciones</Button>
          <Button variant="primary" onClick={() => navigate('/ia/asignacion-materiales/nueva')}>
            Generar Propuesta IA
          </Button>
        </div>
      </div>

      <AsignacionMaterialIaFilters 
        onSearch={(p) => updateParams(p)}
        onClear={() => updateParams({ idTarea: undefined })}
      />

      {error && <div className="error-banner">{error}</div>}

      <Card>
        {loading ? (
          <Loader />
        ) : asignaciones.length > 0 ? (
          <AsignacionesMaterialIaTable
            asignaciones={asignaciones}
            onView={(id) => navigate(`/ia/asignacion-materiales/${id}`)}
            onAdjust={handleAdjust}
            onConfirm={handleConfirm}
            onValidate={handleValidate}
          />
        ) : (
          <EmptyState
            title="No hay asignaciones IA"
            description="Genera una nueva propuesta de asignación para optimizar tus recursos."
          />
        )}
      </Card>

      {showAdjust && selectedAsignacion && (
        <AjustarAsignacionMaterialDialog
          asignacion={selectedAsignacion}
          onClose={() => setShowAdjust(false)}
          onSuccess={refetch}
        />
      )}

      {showConfirm && selectedAsignacion && (
        <ConfirmarAsignacionMaterialDialog
          idAsignacionMaterial={selectedAsignacion.idAsignacionMaterial}
          onClose={() => setShowConfirm(false)}
          onSuccess={refetch}
        />
      )}

      {showValidate && (
        <ValidarRestriccionesAsignacionMaterialDialog
          initialData={selectedAsignacion || undefined}
          onClose={() => {
            setShowValidate(false);
            setSelectedAsignacion(null);
          }}
        />
      )}
    </div>
  );
}
