import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteEditor } from '../components/notes/NoteEditor';

describe('NoteEditor', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields', () => {
    render(
      <NoteEditor
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save note/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    
    render(
      <NoteEditor
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save note/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/string must contain at least 1 character/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    render(
      <NoteEditor
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const bodyInput = screen.getByLabelText(/body/i);
    const saveButton = screen.getByRole('button', { name: /save note/i });

    await user.type(titleInput, 'Test Note');
    await user.type(bodyInput, 'This is a test note body.');
    
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Note',
        body: 'This is a test note body.',
        tags: [],
      });
    });
  });

  it('should populate form with initial values', () => {
    const initialValue = {
      title: 'Existing Note',
      body: 'Existing content',
      tags: ['test', 'existing'],
    };

    render(
      <NoteEditor
        initialValue={initialValue}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue('Existing Note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing content')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('existing')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <NoteEditor
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});