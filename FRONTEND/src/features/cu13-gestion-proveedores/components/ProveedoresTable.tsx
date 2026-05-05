import { Table, Button, Badge } from '../../../shared/components';
import type { Proveedor } from '../types/proveedor.types';

interface ProveedoresTableProps {
  proveedores: Proveedor[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onValidar: (id: number) => void;
}

export function ProveedoresTable({ 
  proveedores, 
  onView, 
  onEdit, 
  onDelete, 
  onValidar 
}: ProveedoresTableProps) {
  return (
    <Table
      data={proveedores}
      columns={[
        { header: 'Nombre', key: 'nombre' },
        { header: 'Correo', key: 'correo' },
        { header: 'Teléfono', key: 'telefono' },
        { header: 'NIT', key: 'nit' },
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
      getRowKey={(p) => p.idProveedor}
      actions={(p) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(p.idProveedor)}>Ver</Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(p.idProveedor)}>Editar</Button>
          <Button size="sm" variant="ghost" onClick={() => onValidar(p.idProveedor)}>Validar</Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(p.idProveedor)}>Eliminar</Button>
        </div>
      )}
    />
  );
}
