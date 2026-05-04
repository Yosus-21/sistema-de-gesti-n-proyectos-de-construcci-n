import React, { InputHTMLAttributes } from 'react';

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input 
      className="form-input" 
      style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
      {...props} 
    />
  );
};
