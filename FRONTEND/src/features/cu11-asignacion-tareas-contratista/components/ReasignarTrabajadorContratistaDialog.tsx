import { useState, useEffect } from 'react';
import { ConfirmDialog, Select, Input, Loader } from '../../../shared/components';
import { trabajadoresService } from '../../cu08-gestion-trabajador/services/trabajadores.service';

interface ReasignarTrabajadorContratistaDialogProps {
  open: boolean;
  onConfirm: (data: { idTrabajador: number; observaciones?: string }) => void;
  onCancel: () => void;
  loading: boolean;
  error?: string | null;
}

export function ReasignarTrabajadorContratistaDialog({ 
  open, onConfirm, onCancel, loading, error 
}: ReasignarTrabajadorContratistaDialogProps) {
  const [idTrabajador, setIdTrabajador] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [trabajadores, setTrabajadores] = useState<{ label: string; value: number }[]>([]);
  const [loadingTrabajadores, setLoadingTrabajadores] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (open) {
      Promise.resolve().then(() => {
        if (!cancelled) setLoadingTrabajadores(true);
      });
      trabajadoresService.listarTrabajadores()
        .then(data => {
          if (cancelled) return;
          setTrabajadores(data.map(w => ({ 
            label: `${w.nombres} ${w.apellidos || ''} (${w.ocupacion})`, 
            value: w.idTrabajador 
          })));
        })
        .catch(console.error)
        .finally(() => {
          if (!cancelled) setLoadingTrabajadores(false);
        });
    }
    return () => { cancelled = true; };
  }, [open]);

  const handleConfirm = () => {
    onConfirm({
      idTrabajador: Number(idTrabajador),
      observaciones: observaciones || undefined
    });
  };

  return (
    <ConfirmDialog
      open={open}
      title="Reasignar Trabajador"
      confirmLabel="Reasignar"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      loading={loading}
    >
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loadingTrabajadores ? (
          <Loader />
        ) : (
          <Select
            label="Nuevo Trabajador"
            value={idTrabajador}
            onChange={(e) => setIdTrabajador(e.target.value)}
            options={trabajadores}
            required
            placeholder="Seleccione un trabajador"
          />
        )}
        <Input
          label="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Motivo de la reasignación"
        />
        {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</p>}
      </div>
    </ConfirmDialog>
  );
}
