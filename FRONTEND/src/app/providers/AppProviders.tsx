import type { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
