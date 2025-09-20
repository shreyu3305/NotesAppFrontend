import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, X } from 'lucide-react';
import { NoteList } from '../components/notes/NoteList';
import { Modal } from '../components/common/Modal';
import { NoteEditor } from '../components/notes/NoteEditor';
import { Button } from '../components/common/Button';
import { useStore } from '../hooks/useStore';
import { Note } from '../shared/schemas';

export const NotesList: React.FC = observer(() => {
  const { notes } = useStore();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load notes and tags on mount
  useEffect(() => {
    notes.fetchList();
    notes.loadTags();
  }, [notes]);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      notes.setQuery(searchQuery);
      notes.fetchList();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, notes]);

  // Refetch when page changes
  useEffect(() => {
    notes.fetchList();
  }, [notes.page, notes.tagFilters]);

  const handleNoteClick = (note: Note) => {
    navigate(`/notes/${note._id}`);
  };

  const handleCreateNote = async (data: { title: string; body: string; tags: string[] }) => {
    await notes.create(data);
    setIsCreateModalOpen(false);
  };

  const toggleTagFilter = (tag: string) => {
    const newFilters = notes.tagFilters.includes(tag)
      ? notes.tagFilters.filter(t => t !== tag)
      : [...notes.tagFilters, tag];
    
    notes.setTagFilters(newFilters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    notes.setQuery('');
    notes.setTagFilters([]);
    notes.fetchList();
  };

  const hasActiveFilters = searchQuery || notes.tagFilters.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Notes</h1>
          <p className="text-gray-600">
            {notes.total > 0 ? `${notes.total} note${notes.total === 1 ? '' : 's'} total` : 'No notes yet'}
          </p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50 text-blue-700' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {notes.tagFilters.length > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notes.tagFilters.length}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Filter by tags</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>
            
            {notes.availableTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {notes.availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTagFilter(tag)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      notes.tagFilters.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tags available</p>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {notes.tagFilters.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                >
                  {tag}
                  <button onClick={() => toggleTagFilter(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes List */}
      <NoteList
        onNoteClick={handleNoteClick}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Note"
        className="max-w-2xl"
      >
        <NoteEditor
          onSubmit={handleCreateNote}
          onCancel={() => setIsCreateModalOpen(false)}
          submitLabel="Create Note"
        />
      </Modal>
    </div>
  );
});