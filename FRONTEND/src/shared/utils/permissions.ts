import type { Role } from '../types/roles.types';

export const hasPermission = (userRole: Role, allowedRoles: Role[]): boolean => {
  return allowedRoles.includes(userRole);
};
