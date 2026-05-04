import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div className="card" style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {title && <h3 style={{ marginBottom: '1rem' }}>{title}</h3>}
      {children}
    </div>
  );
};
