import type { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
