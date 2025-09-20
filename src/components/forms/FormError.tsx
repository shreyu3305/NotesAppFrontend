import React from 'react';

interface FormErrorProps {
  message?: string;
  id?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, id }) => {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-1 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
};