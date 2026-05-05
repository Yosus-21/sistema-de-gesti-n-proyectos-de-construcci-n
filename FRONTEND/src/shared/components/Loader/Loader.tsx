import './loader.css';

interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loader({ text, size = 'md', className = '' }: LoaderProps) {
  return (
    <div className={`loader-container ${className}`}>
      <div className={`loader-spinner loader-${size}`} />
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
}
