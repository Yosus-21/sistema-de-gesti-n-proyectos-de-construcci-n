import { useState } from 'react';
import { Button, Input } from '../../../shared/components';
import type { ContratoDetalle } from '../types/contrato-contratista.types';

interface ContratoDetalleEditorProps {
  detalles: ContratoDetalle[];
  onChange: (detalles: ContratoDetalle[]) => void;
}

export function ContratoDetalleEditor({ detalles, onChange }: ContratoDetalleEditorProps) {
  const [nuevoDetalle, setNuevoDetalle] = useState<ContratoDetalle>({
    descripcion: '',
    cantidad: 1,
    costoUnitario: 0,
  });

  const handleAdd = () => {
    if (!nuevoDetalle.descripcion.trim()) return;
    if ((nuevoDetalle.cantidad || 0) <= 0) return;
    if ((nuevoDetalle.costoUnitario || 0) < 0) return;

    const subtotal = (nuevoDetalle.cantidad || 0) * (nuevoDetalle.costoUnitario || 0);
    onChange([...detalles, { ...nuevoDetalle, subtotal }]);
    setNuevoDetalle({ descripcion: '', cantidad: 1, costoUnitario: 0 });
  };

  const handleRemove = (index: number) => {
    const next = detalles.filter((_, i) => i !== index);
    onChange(next);
  };

  const totalCalculado = detalles.reduce((acc, d) => acc + (d.subtotal || 0), 0);

  return (
    <div className="contrato-detalle-editor">
      <h4>Detalles del Contrato</h4>
      
      <div className="detalle-form">
        <Input
          label="Descripción"
          value={nuevoDetalle.descripcion}
          onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, descripcion: e.target.value })}
          placeholder="Ej: Mano de obra muros"
        />
        <div className="detalle-row">
          <Input
            label="Cantidad"
            type="number"
            value={nuevoDetalle.cantidad}
            onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, cantidad: Number(e.target.value) })}
          />
          <Input
            label="Costo Unitario"
            type="number"
            value={nuevoDetalle.costoUnitario}
            onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, costoUnitario: Number(e.target.value) })}
          />
          <Button type="button" variant="primary" onClick={handleAdd} disabled={!nuevoDetalle.descripcion.trim()}>
            Agregar
          </Button>
        </div>
      </div>

      <div className="detalles-list">
        {detalles.length === 0 ? (
          <p className="empty-text">No hay detalles agregados.</p>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cant.</th>
                  <th>Costo Unit.</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, index) => (
                  <tr key={index}>
                    <td>{d.descripcion}</td>
                    <td>{d.cantidad}</td>
                    <td>{d.costoUnitario}</td>
                    <td>{d.subtotal?.toFixed(2)}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleRemove(index)}>
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Estimado:</td>
                  <td style={{ fontWeight: 'bold' }}>{totalCalculado.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
