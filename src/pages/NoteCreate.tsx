import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NoteEditor } from '../components/notes/NoteEditor';
import { Button } from '../components/common/Button';
import { useStore } from '../hooks/useStore';

export const NoteCreate: React.FC = observer(() => {
  const { notes } = useStore();
  const navigate = useNavigate();

  const handleCreate = async (data: { title: string; body: string; tags: string[] }) => {
    const note = await notes.create(data);
    navigate(`/notes/${note._id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/notes')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <NoteEditor
          onSubmit={handleCreate}
          onCancel={() => navigate('/notes')}
          submitLabel="Create Note"
        />
      </div>
    </div>
  );
});