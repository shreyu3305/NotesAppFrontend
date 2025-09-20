import React from 'react';
import { observer } from 'mobx-react-lite';
import { NoteCard } from './NoteCard';
import { NoteSkeleton } from './NoteSkeleton';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { Note } from '../../shared/schemas';

interface NoteListProps {
  onNoteClick: (note: Note) => void;
  onCreateClick: () => void;
}

export const NoteList: React.FC<NoteListProps> = observer(({ onNoteClick, onCreateClick }) => {
  const { notes } = useStore();

  if (notes.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <NoteSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (notes.items.length === 0) {
    const hasFilters = notes.query || notes.tagFilters.length > 0;
    
    return (
      <EmptyState
        icon={<FileText className="w-full h-full" />}
        title={hasFilters ? 'No notes found' : 'No notes yet'}
        description={hasFilters 
          ? 'Try adjusting your search or filters to find what you\'re looking for.'
          : 'Create your first note to get started organizing your thoughts.'
        }
        actionLabel={hasFilters ? undefined : 'Create your first note'}
        onAction={hasFilters ? undefined : onCreateClick}
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {notes.items.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onClick={onNoteClick}
          />
        ))}
      </div>

      {/* Pagination */}
      {notes.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => notes.setPage(notes.page - 1)}
            disabled={!notes.hasPreviousPage}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <span className="px-4 py-2 text-sm text-gray-700">
            Page {notes.page} of {notes.totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => notes.setPage(notes.page + 1)}
            disabled={!notes.hasNextPage}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
});