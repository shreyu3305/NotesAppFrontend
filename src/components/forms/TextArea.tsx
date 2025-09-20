import React from 'react';
import clsx from 'clsx';
import { FormError } from './FormError';

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string;
  error?: string;
  helper?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helper,
  className,
  id,
  rows = 4,
  ...props
}) => {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const helperId = helper ? `${fieldId}-helper` : undefined;

  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <textarea
        id={fieldId}
        rows={rows}
        className={clsx(
          'block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical',
          error && 'border-red-300 focus:ring-red-500'
        )}
        aria-describedby={clsx(errorId, helperId)}
        aria-invalid={!!error}
        {...props}
      />
      
      {helper && !error && (
        <p id={helperId} className="mt-1 text-sm text-gray-500">
          {helper}
        </p>
      )}
      
      <FormError message={error} id={errorId} />
    </div>
  );
};