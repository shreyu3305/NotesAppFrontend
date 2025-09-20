import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ToastType } from '../../stores/UiStore';

const ToastContainer: React.FC = observer(() => {
  const { ui } = useStore();

  if (ui.toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {ui.toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => ui.removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
});

interface ToastItemProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ type, title, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = icons[type];

  return (
    <div
      className={clsx(
        'max-w-sm w-full bg-white shadow-lg rounded-lg border border-gray-200 p-4 animate-in slide-in-from-right-full',
        colors[type]
      )}
    >
      <div className="flex items-start">
        <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium">{title}</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export { ToastContainer };