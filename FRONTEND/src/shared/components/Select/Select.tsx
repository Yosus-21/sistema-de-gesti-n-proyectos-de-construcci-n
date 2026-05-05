import { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import './select.css';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'placeholder'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export function Select({
  label,
  options,
  error,
  placeholder,
  className = '',
  id,
  required,
  value,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label} {required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`select-field ${error ? 'select-error' : ''}`}
        required={required}
        value={value}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="select-message-error">{error}</span>}
    </div>
  );
}
