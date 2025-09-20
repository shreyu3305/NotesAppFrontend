import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoteList } from '../components/notes/NoteList';
import { rootStore } from '../stores/rootStore';
import { StoreProvider } from '../hooks/useStore';

// Mock the store
vi.mock('../hooks/useStore', () => ({
  useStore: () => rootStore,
  StoreProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('NoteList', () => {
  const mockOnNoteClick = vi.fn();
  const mockOnCreateClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    rootStore.notes.items = [];
    rootStore.notes.status = 'idle';
    rootStore.notes.total = 0;
  });

  it('should show loading skeletons when loading', () => {
    rootStore.notes.status = 'loading';

    render(
      <StoreProvider value={rootStore}>
        <NoteList
          onNoteClick={mockOnNoteClick}
          onCreateClick={mockOnCreateClick}
        />
      </StoreProvider>
    );

    // Should render skeleton elements
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show empty state when no notes', () => {
    render(
      <StoreProvider value={rootStore}>
        <NoteList
          onNoteClick={mockOnNoteClick}
          onCreateClick={mockOnCreateClick}
        />
      </StoreProvider>
    );

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
    expect(screen.getByText(/create your first note/i)).toBeInTheDocument();
  });

  it('should render notes when available', () => {
    const mockNotes = [
      {
        _id: '1',
        title: 'Test Note 1',
        body: 'This is test note 1',
        tags: ['test'],
        ownerId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        title: 'Test Note 2',
        body: 'This is test note 2',
        tags: ['test', 'demo'],
        ownerId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    rootStore.notes.items = mockNotes;
    rootStore.notes.total = 2;

    render(
      <StoreProvider value={rootStore}>
        <NoteList
          onNoteClick={mockOnNoteClick}
          onCreateClick={mockOnCreateClick}
        />
      </StoreProvider>
    );

    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    expect(screen.getByText('Test Note 2')).toBeInTheDocument();
    expect(screen.getByText('This is test note 1')).toBeInTheDocument();
    expect(screen.getByText('This is test note 2')).toBeInTheDocument();
  });
});