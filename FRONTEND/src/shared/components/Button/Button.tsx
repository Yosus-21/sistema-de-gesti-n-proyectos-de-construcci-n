import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <button 
      className={`btn btn-${variant}`} 
      style={{ padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
      {...props}
    >
      {children}
    </button>
  );
};
