"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";

// Legacy ConfirmationDialog component for backward compatibility
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isDoingAction: boolean;
  isDoingActionText?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Tasdiqlash",
  cancelText = "Bekor qilish",
  isDoingActionText = "O'chirilmoqda",
  variant = "danger",
  isDoingAction,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const variantStyles = {
    danger: "text-destructive",
    warning: "text-orange-600",
    info: "text-blue-600",
  };

  const buttonStyles = {
    danger:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    warning: "bg-orange-600 text-white hover:bg-orange-700",
    info: "bg-blue-600 text-white hover:bg-blue-700",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full bg-current/10 flex items-center justify-center ${variantStyles[variant]}`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
              <DialogDescription className="mt-2 text-left">
                {message}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="mt-2 sm:mt-0"
            disabled={isDoingAction}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={buttonStyles[variant]}
            disabled={isDoingAction}
          >
            {isDoingAction ? isDoingActionText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export Dialog components for direct use
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
};
