import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { NoteEditor } from '../components/notes/NoteEditor';
import { Spinner } from '../components/common/Spinner';
import { useStore } from '../hooks/useStore';

export const NoteDetail: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { notes } = useStore();
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      notes.fetchById(id);
    }
    
    return () => {
      notes.clearSelected();
    };
  }, [id, notes]);

  const handleEdit = async (data: { title: string; body: string; tags: string[] }) => {
    if (!id) return;
    
    await notes.update(id, data);
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await notes.remove(id);
      navigate('/notes');
    } catch (error) {
      // Error is handled in the store
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (notes.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (notes.status === 'error' || !notes.selected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Note not found</h2>
        <p className="text-gray-600 mb-4">The note you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/notes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
      </div>
    );
  }

  const note = notes.selected;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/notes')}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Note Content */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {note.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>
            Created {format(new Date(note.createdAt), 'PPP')}
          </span>
          {note.updatedAt !== note.createdAt && (
            <span>
              • Updated {format(new Date(note.updatedAt), 'PPP')}
            </span>
          )}
        </div>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {note.body}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Note"
        className="max-w-2xl"
      >
        <NoteEditor
          initialValue={{
            title: note.title,
            body: note.body,
            tags: note.tags,
          }}
          onSubmit={handleEdit}
          onCancel={() => setIsEditModalOpen(false)}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Note"
        message={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
});