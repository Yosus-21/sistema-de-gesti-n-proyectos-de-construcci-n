import { useState, useEffect, type FormEvent } from 'react';
import { Card, Input, Select, Button } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import { ContratoDetalleEditor } from './ContratoDetalleEditor';
import type { 
  ContratoContratista, 
  RegistrarContratoContratistaDto, 
  ModificarContratoContratistaDto,
  ContratoDetalle,
  EstadoContrato
} from '../types/contrato-contratista.types';

interface ContratoContratistaFormProps {
  initialData?: ContratoContratista;
  onSubmit: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  loading?: boolean;
  onCancel: () => void;
}

export function ContratoContratistaForm({ initialData, onSubmit, loading, onCancel }: ContratoContratistaFormProps) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    idProyecto: initialData?.idProyecto?.toString() || '',
    idContratista: initialData?.idContratista?.toString() || '',
    fechaInicio: initialData?.fechaInicio?.split('T')[0] || '',
    fechaFin: initialData?.fechaFin?.split('T')[0] || '',
    descripcion: initialData?.descripcion || '',
    condiciones: initialData?.condiciones || '',
    estadoContrato: initialData?.estadoContrato || 'VIGENTE' as EstadoContrato,
  });

  const [detalles, setDetalles] = useState<ContratoDetalle[]>(initialData?.detalles || []);
  const [proyectos, setProyectos] = useState<{ label: string; value: number }[]>([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  useEffect(() => {
    let cancelled = false;
    proyectosService.listarProyectos()
      .then(data => {
        if (!cancelled) {
          setProyectos(data.map(p => ({ label: p.nombre, value: p.idProyecto })));
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoadingProyectos(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.idProyecto || !formData.idContratista || !formData.fechaInicio || !formData.fechaFin) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    const payload: RegistrarContratoContratistaDto | ModificarContratoContratistaDto = {
      idProyecto: Number(formData.idProyecto),
      idContratista: Number(formData.idContratista),
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      descripcion: formData.descripcion,
      condiciones: formData.condiciones,
      detalles,
      ...(isEditing ? { estadoContrato: formData.estadoContrato as EstadoContrato } : {})
    };

    onSubmit(payload);
  };

  return (
    <form className="contrato-form" onSubmit={handleSubmit}>
      <Card title={isEditing ? 'Editar Contrato' : 'Registrar Contrato'}>
        <div className="form-grid">
          <Select
            label="Proyecto"
            value={formData.idProyecto}
            onChange={(e) => setFormData({ ...formData, idProyecto: e.target.value })}
            options={proyectos}
            required
            disabled={loadingProyectos}
            placeholder="Seleccione un proyecto"
          />
          <Input
            label="ID Contratista"
            type="number"
            value={formData.idContratista}
            onChange={(e) => setFormData({ ...formData, idContratista: e.target.value })}
            required
            placeholder="Ingrese ID del contratista"
          />
          <Input
            label="Fecha Inicio"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
            required
          />
          <Input
            label="Fecha Fin"
            type="date"
            value={formData.fechaFin}
            onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
            required
          />
          {isEditing && (
            <Select
              label="Estado"
              value={formData.estadoContrato}
              onChange={(e) => setFormData({ ...formData, estadoContrato: e.target.value as EstadoContrato })}
              options={[
                { label: 'VIGENTE', value: 'VIGENTE' },
                { label: 'FINALIZADO', value: 'FINALIZADO' },
                { label: 'CANCELADO', value: 'CANCELADO' }
              ]}
              required
            />
          )}
          <Input
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Breve descripción del objeto del contrato"
          />
          <Input
            label="Condiciones"
            value={formData.condiciones}
            onChange={(e) => setFormData({ ...formData, condiciones: e.target.value })}
            placeholder="Condiciones especiales o cláusulas"
          />
        </div>

        <ContratoDetalleEditor detalles={detalles} onChange={setDetalles} />

        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEditing ? 'Guardar Cambios' : 'Registrar Contrato'}
          </Button>
        </div>
      </Card>
    </form>
  );
}
