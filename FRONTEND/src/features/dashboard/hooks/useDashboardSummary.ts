import { useState, useEffect } from 'react';
import { httpClient } from '../../../shared/api/http-client';
import { useAuth } from '../../../app/providers/AuthProvider';

export interface DashboardSummary {
  proyectosCount: number | null;
  tareasFinaCount: number | null;
  tareasBrutaCount: number | null;
  materialesCount: number | null;
  ordenesCompraCount: number | null;
  alertasCount: number | null;
  reportesCount: number | null;
  loading: boolean;
  errors: Record<string, string>;
}

export function useDashboardSummary() {
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary>({
    proyectosCount: null,
    tareasFinaCount: null,
    tareasBrutaCount: null,
    materialesCount: null,
    ordenesCompraCount: null,
    alertasCount: null,
    reportesCount: null,
    loading: true,
    errors: {},
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      const endpoints = [
        { key: 'proyectosCount', url: '/cu02/proyectos' },
        { key: 'tareasFinaCount', url: '/cu03/tareas-obra-fina' },
        { key: 'tareasBrutaCount', url: '/cu04/tareas-obra-bruta' },
        { key: 'materialesCount', url: '/cu12/materiales' },
        { key: 'ordenesCompraCount', url: '/cu14/ordenes-compra' },
        { key: 'alertasCount', url: '/cu18/alertas-notificaciones' },
        { key: 'reportesCount', url: '/cu19/reportes' },
      ];

      const results = await Promise.all(
        endpoints.map(async (e) => {
          try {
            const data = await httpClient.get<unknown[]>(e.url);
            return { key: e.key, value: data.length, error: null };
          } catch (error: unknown) {
            // Tolerant to 403 or other errors
            const status = (error as { status?: number }).status;
            return { 
              key: e.key, 
              value: null, 
              error: status === 403 ? 'Sin acceso' : 'Error al cargar' 
            };
          }
        })
      );

      const newSummary: Record<string, number | null> = {};
      const newErrors: Record<string, string> = {};

      results.forEach(res => {
        newSummary[res.key] = res.value;
        if (res.error) {
          newErrors[res.key] = res.error;
        }
      });

      setSummary(prev => ({
        ...prev,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...newSummary as any,
        errors: newErrors,
        loading: false,
      }));
    };

    fetchData();
  }, [isAuthenticated]);

  return summary;
}
