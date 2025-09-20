import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Note } from '../../shared/schemas';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  const handleClick = () => {
    onClick(note);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(note);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const formatDate = (date: string) => {
    const noteDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - noteDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(noteDate, { addSuffix: true });
    } else {
      return format(noteDate, 'MMM d, yyyy');
    }
  };

  const displayTags = note.tags.slice(0, 3);
  const remainingTagsCount = note.tags.length - 3;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {note.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
        {truncateText(note.body, 120)}
      </p>
      
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg"
            >
              {tag}
            </span>
          ))}
          {remainingTagsCount > 0 && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
              +{remainingTagsCount}
            </span>
          )}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        {formatDate(note.updatedAt)}
      </p>
    </div>
  );
};