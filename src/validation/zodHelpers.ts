import { ZodError } from 'zod';

export function formatZodErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  error.issues.forEach((issue) => {
    const field = issue.path.join('.');
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  });
  
  return fieldErrors;
}

export function getFieldError(errors: Record<string, string>, field: string): string | undefined {
  return errors[field];
}