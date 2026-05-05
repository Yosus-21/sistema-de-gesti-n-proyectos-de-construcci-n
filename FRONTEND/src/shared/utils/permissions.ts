import type { Role } from '../types/roles.types';
import { Role as RoleEnum } from '../types/roles.types';

export const hasRole = (userRole: Role | undefined, allowedRoles: Role[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export type ModuleKey = 
  | 'DASHBOARD'
  | 'CLIENTES'
  | 'PROYECTOS'
  | 'CRONOGRAMAS'
  | 'TAREAS'
  | 'SEGUIMIENTO'
  | 'CONTRATOS'
  | 'TRABAJADORES'
  | 'ASIGNACIONES'
  | 'MATERIALES'
  | 'PROVEEDORES'
  | 'ORDENES_COMPRA'
  | 'ENTREGAS_MATERIALES'
  | 'IA'
  | 'ALERTAS'
  | 'REPORTES';

export const canAccessModule = (userRole: Role | undefined, moduleKey: ModuleKey): boolean => {
  if (!userRole) return false;
  if (userRole === RoleEnum.ADMIN) return true;

  const accessMap: Record<Role, ModuleKey[]> = {
    [RoleEnum.ADMIN]: [], // Handled above
    [RoleEnum.GESTOR_PROYECTO]: [
      'DASHBOARD', 'CLIENTES', 'PROYECTOS', 'CRONOGRAMAS', 'TAREAS', 'SEGUIMIENTO', 
      'CONTRATOS', 'TRABAJADORES', 'ASIGNACIONES', 'MATERIALES', 'ORDENES_COMPRA', 
      'ENTREGAS_MATERIALES', 'IA', 'ALERTAS', 'REPORTES'
    ],
    [RoleEnum.INGENIERO]: [
      'DASHBOARD', 'PROYECTOS', 'CRONOGRAMAS', 'TAREAS', 'SEGUIMIENTO', 
      'TRABAJADORES', 'ASIGNACIONES', 'ALERTAS', 'REPORTES'
    ],
    [RoleEnum.ENCARGADO_COMPRAS]: [
      'DASHBOARD', 'MATERIALES', 'PROVEEDORES', 'ORDENES_COMPRA', 
      'ENTREGAS_MATERIALES', 'IA', 'ALERTAS', 'REPORTES'
    ],
    [RoleEnum.CONTRATISTA]: [
      'DASHBOARD', 'PROYECTOS', 'TAREAS', 'ASIGNACIONES', 'CONTRATOS', 'ALERTAS', 'REPORTES'
    ],
    [RoleEnum.LECTOR]: [
      'DASHBOARD', 'CLIENTES', 'PROYECTOS', 'CRONOGRAMAS', 'TAREAS', 'SEGUIMIENTO', 
      'CONTRATOS', 'TRABAJADORES', 'ASIGNACIONES', 'MATERIALES', 'PROVEEDORES', 
      'ORDENES_COMPRA', 'ENTREGAS_MATERIALES', 'IA', 'ALERTAS', 'REPORTES'
    ],
  };

  return accessMap[userRole]?.includes(moduleKey) || false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const canPerformAction = (userRole: Role | undefined, _actionKey?: string): boolean => {
  if (!userRole) return false;
  if (userRole === RoleEnum.ADMIN) return true;
  if (userRole === RoleEnum.LECTOR) return false;
  
  // For now, most roles can perform actions in their modules
  // LECTOR is the only one explicitly forbidden globally in the visual matrix instructions
  return true;
};

export interface MenuItem {
  label: string;
  to: string;
  module?: ModuleKey;
}

export interface NavGroup {
  title: string;
  items: MenuItem[];
}

export const getSidebarConfig = (userRole: Role | undefined): NavGroup[] => {
  const allGroups: NavGroup[] = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Principal', to: '/dashboard', module: 'DASHBOARD' },
      ],
    },
    {
      title: 'Gestión de Proyectos',
      items: [
        { label: 'Clientes', to: '/clientes', module: 'CLIENTES' },
        { label: 'Proyectos', to: '/proyectos', module: 'PROYECTOS' },
        { label: 'Cronogramas', to: '/cronogramas', module: 'CRONOGRAMAS' },
        { label: 'Tareas Obra Fina', to: '/tareas/obra-fina', module: 'TAREAS' },
        { label: 'Tareas Obra Bruta', to: '/tareas/obra-bruta', module: 'TAREAS' },
        { label: 'Seguimiento', to: '/seguimientos', module: 'SEGUIMIENTO' },
      ],
    },
    {
      title: 'Contratos y Personal',
      items: [
        { label: 'Contratos', to: '/contratos', module: 'CONTRATOS' },
        { label: 'Trabajadores', to: '/trabajadores', module: 'TRABAJADORES' },
        { label: 'Asignación Obra Bruta', to: '/asignaciones/obra-bruta', module: 'ASIGNACIONES' },
        { label: 'Asignación Obra Fina', to: '/asignaciones/obra-fina', module: 'ASIGNACIONES' },
        { label: 'Asignación Contratista', to: '/asignaciones/contratista', module: 'ASIGNACIONES' },
      ],
    },
    {
      title: 'Compras e Inventario',
      items: [
        { label: 'Materiales', to: '/materiales', module: 'MATERIALES' },
        { label: 'Proveedores', to: '/proveedores', module: 'PROVEEDORES' },
        { label: 'Órdenes de Compra', to: '/ordenes-compra', module: 'ORDENES_COMPRA' },
        { label: 'Entregas de Materiales', to: '/entregas-materiales', module: 'ENTREGAS_MATERIALES' },
      ],
    },
    {
      title: 'Inteligencia Artificial',
      items: [
        { label: 'Asignación Materiales IA', to: '/ia/asignacion-materiales', module: 'IA' },
        { label: 'Pronóstico Materiales IA', to: '/ia/pronostico-materiales', module: 'IA' },
      ],
    },
    {
      title: 'Comunicación y Reportes',
      items: [
        { label: 'Alertas y Notificaciones', to: '/alertas', module: 'ALERTAS' },
        { label: 'Reportes', to: '/reportes', module: 'REPORTES' },
      ],
    },
  ];

  return allGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.module || canAccessModule(userRole, item.module))
    }))
    .filter(group => group.items.length > 0);
};
