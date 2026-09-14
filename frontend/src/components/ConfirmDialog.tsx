import React from "react";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      title={title}
    >
      <div className="sm:flex sm:items-start">
        <div
          className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${isDestructive ? "bg-red-100" : "bg-brand-100"}`}
        >
          <AlertTriangle
            className={`h-6 w-6 ${isDestructive ? "text-red-600" : "text-brand-600"}`}
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          disabled={isLoading}
          className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto disabled:opacity-50 ${
            isDestructive
              ? "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600"
              : "bg-brand-600 hover:bg-brand-500 focus-visible:outline-brand-600"
          }`}
          onClick={onConfirm}
        >
          {isLoading ? "Processing..." : confirmText}
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={onClose}
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
}
