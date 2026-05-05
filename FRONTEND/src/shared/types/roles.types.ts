export const Role = {
  ADMIN: 'ADMIN',
  GESTOR_PROYECTO: 'GESTOR_PROYECTO',
  INGENIERO: 'INGENIERO',
  ENCARGADO_COMPRAS: 'ENCARGADO_COMPRAS',
  CONTRATISTA: 'CONTRATISTA',
  LECTOR: 'LECTOR'
} as const;

export type Role = typeof Role[keyof typeof Role];
