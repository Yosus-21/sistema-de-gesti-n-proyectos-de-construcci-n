import type { ReactNode } from 'react';
import './table.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (item: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  actions?: (item: T) => ReactNode;
}

export function Table<T>({
  columns,
  data,
  getRowKey,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  actions,
}: TableProps<T>) {
  const colSpan = columns.length + (actions ? 1 : 0);

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
            {actions && <th className="table-actions-col">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colSpan} className="table-loading">
                Cargando datos...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={getRowKey(item)}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
                {actions && (
                  <td className="table-actions-cell">{actions(item)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
