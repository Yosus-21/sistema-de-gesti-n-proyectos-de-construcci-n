import React from 'react';
import { Button } from '../Button/Button';
import './confirm-dialog.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  children,
  confirmText,
  cancelText,
  showCancel = true,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3 className="dialog-title">{title}</h3>
        {message && <p className="dialog-message">{message}</p>}
        {children}
        <div className="dialog-actions">
          {showCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={loading}>
              {cancelText || cancelLabel}
            </Button>
          )}
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText || confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
