import { Table, Button, Badge, Can } from '../../../shared/components';
import { Role } from '../../../shared/types/roles.types';
import type { Material } from '../types/material.types';

interface MaterialesTableProps {
  materiales: Material[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onActualizarStock: (id: number) => void;
  onVerificarDisponibilidad: (id: number) => void;
}

export function MaterialesTable({ 
  materiales, 
  onView, 
  onEdit, 
  onDelete, 
  onActualizarStock, 
  onVerificarDisponibilidad 
}: MaterialesTableProps) {
  const writeRoles = [Role.ADMIN, Role.GESTOR_PROYECTO, Role.ENCARGADO_COMPRAS];

  return (
    <Table
      data={materiales}
      columns={[
        { header: 'Nombre', key: 'nombre' },
        { 
          header: 'Tipo', 
          key: 'tipoMaterial',
          render: (item) => <Badge variant="info">{item.tipoMaterial || 'N/A'}</Badge>
        },
        { header: 'Unidad', key: 'unidadMedida' },
        { 
          header: 'Stock', 
          key: 'cantidadDisponible',
          render: (item) => {
            const lowStock = item.cantidadDisponible !== undefined && item.stockMinimo !== undefined && item.cantidadDisponible <= item.stockMinimo;
            return (
              <span style={{ color: lowStock ? 'var(--color-danger)' : 'inherit', fontWeight: lowStock ? 'bold' : 'normal' }}>
                {item.cantidadDisponible} {lowStock && ' (Bajo Stock)'}
              </span>
            );
          }
        },
        { 
          header: 'Costo Unit.', 
          key: 'costoUnitario',
          render: (item) => `$${(item.costoUnitario || 0).toLocaleString()}`
        },
        {
          header: 'Estado',
          key: 'activo',
          render: (item) => (
            <Badge variant={item.activo ? 'success' : 'neutral'}>
              {item.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          )
        }
      ]}
      getRowKey={(m) => m.idMaterial}
      actions={(m) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(m.idMaterial)}>Ver</Button>
          <Can roles={writeRoles}>
            <Button size="sm" variant="ghost" onClick={() => onEdit(m.idMaterial)}>Editar</Button>
          </Can>
          <Can roles={writeRoles}>
            <Button size="sm" variant="ghost" onClick={() => onActualizarStock(m.idMaterial)}>Stock</Button>
          </Can>
          <Button size="sm" variant="ghost" onClick={() => onVerificarDisponibilidad(m.idMaterial)}>Disp.</Button>
          <Can roles={writeRoles}>
            <Button size="sm" variant="ghost" onClick={() => onDelete(m.idMaterial)}>Eliminar</Button>
          </Can>
        </div>
      )}
    />
  );
}
