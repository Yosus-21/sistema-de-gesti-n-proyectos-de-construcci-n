import { useState, useEffect } from 'react';
import { Button, Input, Select, Loader, Card } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import { materialesService } from '../../cu12-registro-materiales/services/materiales.service';
import type { GenerarPronosticoMaterialDto } from '../types/pronostico-material-ia.types';

interface GenerarPronosticoMaterialFormProps {
  onSubmit: (data: GenerarPronosticoMaterialDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

export function GenerarPronosticoMaterialForm({ onSubmit, loading, onCancel }: GenerarPronosticoMaterialFormProps) {
  const [formData, setFormData] = useState<GenerarPronosticoMaterialDto>({
    idProyecto: 0,
    idMaterial: undefined,
    stockMinimo: 0,
    stockMaximo: 0,
    observaciones: '',
  });

  const [proyectos, setProyectos] = useState<{ value: number; label: string }[]>([]);
  const [materiales, setMateriales] = useState<{ value: number; label: string }[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projs, mats] = await Promise.all([
          proyectosService.listarProyectos(),
          materialesService.listarMateriales()
        ]);
        setProyectos(projs.map(p => ({ value: p.idProyecto, label: p.nombre })));
        setMateriales(mats.map(m => ({ value: m.idMaterial, label: m.nombre })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLists(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'idProyecto' || name === 'idMaterial' || name === 'stockMinimo' || name === 'stockMaximo')
        ? (value === '' ? undefined : Number(value))
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loadingLists) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="ia-form">
      <Card className="ia-info-card">
        <p><strong>Nota:</strong> El pronóstico será generado por el backend. Si la IA está deshabilitada o falla, se usará fallback heurístico seguro.</p>
      </Card>

      <div className="form-grid">
        <Select
          label="Proyecto"
          name="idProyecto"
          value={formData.idProyecto || ''}
          onChange={handleChange}
          options={proyectos}
          required
        />
        <Select
          label="Material (Opcional)"
          name="idMaterial"
          value={formData.idMaterial || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Analizar todos los materiales' },
            ...materiales
          ]}
        />
        <Input
          label="Stock Mínimo Estimado"
          name="stockMinimo"
          type="number"
          value={formData.stockMinimo}
          onChange={handleChange}
          min={0}
          required
        />
        <Input
          label="Stock Máximo Estimado"
          name="stockMaximo"
          type="number"
          value={formData.stockMaximo}
          onChange={handleChange}
          min={formData.stockMinimo}
          required
        />
      </div>

      <div className="form-full">
        <label className="input-label">Observaciones Adicionales</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Ej: Considerar temporada de lluvias, huelgas de transporte..."
        />
      </div>

      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel} type="button">Cancelar</Button>
        <Button variant="primary" type="submit" loading={loading}>Generar Pronóstico IA</Button>
      </div>
    </form>
  );
}
