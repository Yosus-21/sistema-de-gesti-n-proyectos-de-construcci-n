import { useState } from 'react';
import { Button, Select } from '../../../shared/components';
import { EstadoProyecto } from '../types/proyecto.types';

interface CambiarEstadoProyectoDialogProps {
  open: boolean;
  actualEstado: EstadoProyecto;
  onConfirm: (nuevoEstado: EstadoProyecto) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ESTADO_OPTIONS = [
  { label: 'Planificación', value: EstadoProyecto.PLANIFICACION },
  { label: 'En Progreso', value: EstadoProyecto.EN_PROGRESO },
  { label: 'Finalizado', value: EstadoProyecto.FINALIZADO },
  { label: 'Cancelado', value: EstadoProyecto.CANCELADO },
];

export function CambiarEstadoProyectoDialog({
  open,
  actualEstado,
  onConfirm,
  onCancel,
  loading = false,
}: CambiarEstadoProyectoDialogProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoProyecto>(actualEstado);

  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3 className="dialog-title">Cambiar Estado del Proyecto</h3>
        <p className="dialog-message">
          Seleccione el nuevo estado para el proyecto.
        </p>
        
        <Select
          label="Nuevo Estado"
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(e.target.value as EstadoProyecto)}
          options={ESTADO_OPTIONS}
        />

        <div className="dialog-actions" style={{ marginTop: '1.5rem' }}>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => onConfirm(nuevoEstado)} loading={loading}>
            Actualizar Estado
          </Button>
        </div>
      </div>
    </div>
  );
}
