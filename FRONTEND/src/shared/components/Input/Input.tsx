import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import './input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  required,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''}`}
        required={required}
        {...props}
      />
      {(error ?? helperText) && (
        <span className={`input-message ${error ? 'input-message-error' : ''}`}>
          {error ?? helperText}
        </span>
      )}
    </div>
  );
}
