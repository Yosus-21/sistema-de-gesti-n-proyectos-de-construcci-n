import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Loader, EmptyState } from '../../../shared/components';
import { usePronosticosMaterialIa } from '../hooks/usePronosticosMaterialIa';
import { PronosticosMaterialIaTable } from '../components/PronosticosMaterialIaTable';
import { PronosticoMaterialIaFilters } from '../components/PronosticoMaterialIaFilters';
import { AjustarPronosticoMaterialDialog } from '../components/AjustarPronosticoMaterialDialog';
import { ConfirmarPronosticoMaterialDialog } from '../components/ConfirmarPronosticoMaterialDialog';
import { CalcularConfianzaPronosticoDialog } from '../components/CalcularConfianzaPronosticoDialog';
import type { PronosticoMaterialIa } from '../types/pronostico-material-ia.types';
import '../styles/pronostico-materiales-ia.css';

export function PronosticosMaterialIaPage() {
  const navigate = useNavigate();
  const { pronosticos, loading, error, refetch, updateParams } = usePronosticosMaterialIa();
  
  const [selectedPronostico, setSelectedPronostico] = useState<PronosticoMaterialIa | null>(null);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);

  const handleAdjust = (id: number) => {
    const item = pronosticos.find(p => p.idPronosticoMaterial === id);
    if (item) {
      setSelectedPronostico(item);
      setShowAdjust(true);
    }
  };

  const handleConfirm = (id: number) => {
    const item = pronosticos.find(p => p.idPronosticoMaterial === id);
    if (item) {
      setSelectedPronostico(item);
      setShowConfirm(true);
    }
  };

  const handleCheckConfidence = (id: number) => {
    setSelectedPronostico(pronosticos.find(p => p.idPronosticoMaterial === id) || null);
    setShowConfidence(true);
  };

  return (
    <div className="ia-page">
      <div className="page-header">
        <div>
          <h1>Pronóstico de Materiales (IA)</h1>
          <p className="page-subtitle">Predicción de niveles de stock necesarios mediante análisis predictivo IA.</p>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={() => navigate('/ia/pronostico-materiales/nuevo')}>
            Generar Pronóstico IA
          </Button>
        </div>
      </div>

      <PronosticoMaterialIaFilters 
        onSearch={(p) => updateParams(p)}
        onClear={() => updateParams({ idProyecto: undefined, idMaterial: undefined })}
      />

      {error && <div className="error-banner">{error}</div>}

      <Card>
        {loading ? (
          <Loader />
        ) : pronosticos.length > 0 ? (
          <PronosticosMaterialIaTable
            pronosticos={pronosticos}
            onView={(id) => navigate(`/ia/pronostico-materiales/${id}`)}
            onAdjust={handleAdjust}
            onConfirm={handleConfirm}
            onCheckConfidence={handleCheckConfidence}
          />
        ) : (
          <EmptyState
            title="No hay pronósticos IA"
            description="Genera un nuevo pronóstico para anticipar tus necesidades de materiales."
          />
        )}
      </Card>

      {showAdjust && selectedPronostico && (
        <AjustarPronosticoMaterialDialog
          pronostico={selectedPronostico}
          onClose={() => setShowAdjust(false)}
          onSuccess={refetch}
        />
      )}

      {showConfirm && selectedPronostico && (
        <ConfirmarPronosticoMaterialDialog
          idPronosticoMaterial={selectedPronostico.idPronosticoMaterial}
          onClose={() => setShowConfirm(false)}
          onSuccess={refetch}
        />
      )}

      {showConfidence && selectedPronostico && (
        <CalcularConfianzaPronosticoDialog
          idPronosticoMaterial={selectedPronostico.idPronosticoMaterial}
          onClose={() => setShowConfidence(false)}
        />
      )}
    </div>
  );
}
