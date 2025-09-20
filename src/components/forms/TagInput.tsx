import React, { useState, KeyboardEvent } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { FormError } from './FormError';

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  helper?: string;
  maxTags?: number;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  value,
  onChange,
  error,
  helper,
  maxTags = 10,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');

  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const helperId = helper ? `${fieldId}-helper` : undefined;

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div
        className={clsx(
          'min-h-[2.5rem] w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors',
          error && 'border-red-300 focus-within:ring-red-500'
        )}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          
          {value.length < maxTags && (
            <input
              id={fieldId}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm placeholder-gray-500"
              placeholder={value.length === 0 ? 'Type and press Enter to add tags' : 'Add another tag...'}
              aria-describedby={clsx(errorId, helperId)}
              aria-invalid={!!error}
            />
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-1">
        <div>
          {helper && !error && (
            <p id={helperId} className="text-sm text-gray-500">
              {helper}
            </p>
          )}
          <FormError message={error} id={errorId} />
        </div>
        
        <p className="text-sm text-gray-500">
          {value.length}/{maxTags}
        </p>
      </div>
    </div>
  );
};