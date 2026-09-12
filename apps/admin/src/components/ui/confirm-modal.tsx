'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './modal';
import { Button } from './button';

export interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly message: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly isLoading?: boolean;
  readonly isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  isDestructive = true,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {isDestructive && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive border border-destructive/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-4 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? 'destructiveSolid' : 'primary'}
            className="w-full sm:w-auto"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
