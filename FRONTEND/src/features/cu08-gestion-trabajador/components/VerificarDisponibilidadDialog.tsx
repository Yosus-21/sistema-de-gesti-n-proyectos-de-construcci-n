import { useState, type ChangeEvent } from 'react';
import { Button, Input, Table, Badge, Loader } from '../../../shared/components';
import type { Column } from '../../../shared/components';
import type { 
  Trabajador, 
  VerificarDisponibilidadTrabajadorParams, 
  DisponibilidadTrabajadorResponse,
  ConflictoDisponibilidad
} from '../types/trabajador.types';

interface VerificarDisponibilidadDialogProps {
  open: boolean;
  trabajador: Trabajador;
  onVerificar: (params: VerificarDisponibilidadTrabajadorParams) => void;
  onClose: () => void;
  loading?: boolean;
  resultado: DisponibilidadTrabajadorResponse | null;
  error?: string | null;
}

export function VerificarDisponibilidadDialog({
  open,
  trabajador,
  onVerificar,
  onClose,
  loading = false,
  resultado,
  error,
}: VerificarDisponibilidadDialogProps) {
  const [params, setParams] = useState<VerificarDisponibilidadTrabajadorParams>({
    fechaInicio: '',
    fechaFin: '',
  });

  if (!open) return null;

  const handleChange = (field: keyof VerificarDisponibilidadTrabajadorParams) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setParams((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleVerificar = () => {
    if (!params.fechaInicio || !params.fechaFin) return;
    onVerificar(params);
  };

  const columns: Column<ConflictoDisponibilidad>[] = [
    {
      key: 'tarea',
      header: 'Tarea / Proyecto',
      render: (c) => c.nombreTarea || `Tarea ID: ${c.idTarea}`,
    },
    {
      key: 'fechaInicio',
      header: 'Desde',
      render: (c) => new Date(c.fechaInicio).toLocaleDateString('es-VE'),
    },
    {
      key: 'fechaFin',
      header: 'Hasta',
      render: (c) => new Date(c.fechaFin).toLocaleDateString('es-VE'),
    },
    {
      key: 'estadoAsignacion',
      header: 'Estado',
      render: (c) => <Badge variant="warning">{c.estadoAsignacion}</Badge>,
    },
  ];

  return (
    <div className="dialog-overlay">
      <div className="dialog-content" style={{ maxWidth: '800px', width: '90%' }}>
        <h3 className="dialog-title">Verificar Disponibilidad</h3>
        <p className="dialog-message">
          Consultar si <strong>{trabajador.nombres}</strong> está libre en un rango de fechas.
        </p>

        <div className="form-row" style={{ marginTop: '1.5rem' }}>
          <Input
            label="Fecha Inicio"
            type="date"
            value={params.fechaInicio}
            onChange={handleChange('fechaInicio')}
          />
          <Input
            label="Fecha Fin"
            type="date"
            value={params.fechaFin}
            onChange={handleChange('fechaFin')}
          />
        </div>

        <div className="dialog-actions" style={{ marginTop: '1rem', justifyContent: 'flex-start' }}>
          <Button 
            variant="primary" 
            onClick={handleVerificar} 
            loading={loading}
            disabled={!params.fechaInicio || !params.fechaFin}
          >
            Verificar Rango
          </Button>
        </div>

        {error && <div className="feedback-banner error" style={{ marginTop: '1rem' }}>{error}</div>}

        {loading && <Loader text="Consultando asignaciones..." />}

        {resultado && !loading && (
          <div className="availability-result" style={{ marginTop: '2rem' }}>
            <div className={`result-summary ${resultado.disponible ? 'success' : 'danger'}`}>
              <Badge variant={resultado.disponible ? 'success' : 'danger'}>
                {resultado.disponible ? 'DISPONIBLE' : 'NO DISPONIBLE'}
              </Badge>
              <p>
                {resultado.disponible 
                  ? 'El trabajador no tiene tareas asignadas en este rango.' 
                  : `Se encontraron ${resultado.conflictos.length} conflicto(s) de agenda.`}
              </p>
            </div>

            {!resultado.disponible && resultado.conflictos.length > 0 && (
              <div className="conflicts-table" style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Conflictos detectados:</h4>
                <Table<ConflictoDisponibilidad>
                  columns={columns}
                  data={resultado.conflictos}
                  getRowKey={(c) => c.idTarea}
                />
              </div>
            )}
          </div>
        )}

        <div className="dialog-actions" style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
