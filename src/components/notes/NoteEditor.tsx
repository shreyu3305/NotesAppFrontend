import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { NoteCreateSchema } from '../../shared/schemas';
import { formatZodErrors } from '../../validation/zodHelpers';
import { TextField } from '../forms/TextField';
import { TextArea } from '../forms/TextArea';
import { TagInput } from '../forms/TagInput';
import { Button } from '../common/Button';

interface NoteEditorProps {
  initialValue?: {
    title: string;
    body: string;
    tags: string[];
  };
  onSubmit: (data: { title: string; body: string; tags: string[] }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = observer(({
  initialValue,
  onSubmit,
  onCancel,
  submitLabel = 'Save Note',
}) => {
  const [formData, setFormData] = useState({
    title: initialValue?.title || '',
    body: initialValue?.body || '',
    tags: initialValue?.tags || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setFormData({
        title: initialValue.title,
        body: initialValue.body,
        tags: initialValue.tags,
      });
    }
  }, [initialValue]);

  const validate = () => {
    try {
      NoteCreateSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors = formatZodErrors(error);
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isValid = !Object.values(errors).some(Boolean) && 
                  formData.title.trim() && 
                  formData.body.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Title"
        value={formData.title}
        onChange={(e) => updateField('title', e.target.value)}
        error={errors.title}
        placeholder="Enter note title..."
        maxLength={120}
        required
      />

      <TextArea
        label="Body"
        value={formData.body}
        onChange={(e) => updateField('body', e.target.value)}
        error={errors.body}
        placeholder="Write your note here..."
        rows={8}
        required
      />

      <TagInput
        label="Tags"
        value={formData.tags}
        onChange={(tags) => updateField('tags', tags)}
        error={errors.tags}
        helper="Press Enter to add tags. Use tags to organize your notes."
        maxTags={10}
      />

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          className="flex-1"
        >
          {submitLabel}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
});