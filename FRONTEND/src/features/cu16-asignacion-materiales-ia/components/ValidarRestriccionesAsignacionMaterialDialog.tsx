import { useState, useEffect } from 'react';
import { Card, Button, Select, Input, Loader, Badge } from '../../../shared/components';
import { useValidarRestriccionesAsignacionMaterial } from '../hooks/useValidarRestriccionesAsignacionMaterial';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import { materialesService } from '../../cu12-registro-materiales/services/materiales.service';
import { tareasObraFinaService } from '../../cu03-gestion-tareas-obra-fina/services/tareas-obra-fina.service';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import type { AsignacionMaterialIa } from '../types/asignacion-material-ia.types';

interface ValidarRestriccionesAsignacionMaterialDialogProps {
  initialData?: AsignacionMaterialIa;
  onClose: () => void;
}

export function ValidarRestriccionesAsignacionMaterialDialog({ initialData, onClose }: ValidarRestriccionesAsignacionMaterialDialogProps) {
  const { validarRestricciones, loading, error, resultado } = useValidarRestriccionesAsignacionMaterial();
  
  const [formData, setFormData] = useState({
    idProyecto: 0,
    idTarea: initialData?.idTarea || 0,
    idMaterial: initialData?.idMaterial || 0,
    cantidad: initialData?.cantidadAsignada || 0,
    restricciones: initialData?.restricciones || '',
  });

  const [proyectos, setProyectos] = useState<{ value: number; label: string }[]>([]);
  const [tareas, setTareas] = useState<{ value: number; label: string }[]>([]);
  const [materiales, setMateriales] = useState<{ value: number; label: string }[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projs, tasksFina, tasksBruta, mats] = await Promise.all([
          proyectosService.listarProyectos(),
          tareasObraFinaService.listarTareasObraFina(),
          tareasObraBrutaService.listarTareasObraBruta(),
          materialesService.listarMateriales()
        ]);
        
        setProyectos(projs.map(p => ({ value: p.idProyecto, label: p.nombre })));
        setTareas([
          ...tasksFina.map(t => ({ value: t.idTarea, label: `(F) ${t.nombre}` })),
          ...tasksBruta.map(t => ({ value: t.idTarea, label: `(B) ${t.nombre}` }))
        ]);
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
      [name]: (name === 'restricciones') ? value : Number(value)
    }));
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    await validarRestricciones(formData);
  };

  if (loadingLists) return <div className="modal-overlay"><Loader /></div>;

  return (
    <div className="modal-overlay">
      <Card className="modal-content large" title="Validar Restricciones de Asignación">
        <form onSubmit={handleValidate}>
          <div className="form-grid">
            <Select
              label="Proyecto"
              name="idProyecto"
              value={formData.idProyecto}
              onChange={handleChange}
              options={proyectos}
              required
            />
            <Select
              label="Tarea"
              name="idTarea"
              value={formData.idTarea}
              onChange={handleChange}
              options={tareas}
              required
            />
            <Select
              label="Material"
              name="idMaterial"
              value={formData.idMaterial}
              onChange={handleChange}
              options={materiales}
              required
            />
            <Input
              label="Cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={handleChange}
              required
              min={1}
            />
          </div>

          <div className="form-full" style={{ marginTop: '1rem' }}>
            <label className="input-label">Restricciones a Validar</label>
            <textarea
              name="restricciones"
              value={formData.restricciones}
              onChange={handleChange}
              className="form-textarea"
              rows={2}
              placeholder="Ej: Solo material certificado, entrega en menos de 24h..."
            />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Button variant="primary" type="submit" loading={loading}>Ejecutar Validación</Button>
          </div>
        </form>

        {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}

        {resultado && (
          <div className="validation-results" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0 }}>Resultado del Backend</h4>
              <Badge variant={resultado.cumpleRestricciones ? 'success' : 'danger'}>
                {resultado.cumpleRestricciones ? 'CUMPLE' : 'NO CUMPLE'}
              </Badge>
              <Badge variant={resultado.nivelRiesgo === 'BAJO' ? 'success' : resultado.nivelRiesgo === 'MEDIO' ? 'warning' : 'danger'}>
                Riesgo: {resultado.nivelRiesgo}
              </Badge>
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              {resultado.mensajes.map((m, i) => (
                <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}
