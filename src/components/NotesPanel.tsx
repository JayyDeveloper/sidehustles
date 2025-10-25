import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import type { Note } from '../types/schema';
import { formatDateTime } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';
import { Button } from './Button';
import { Textarea } from './Input';
import ReactMarkdown from 'react-markdown';

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (content: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export function NotesPanel({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAdd = async () => {
    if (!newNoteContent.trim()) return;

    try {
      await onAddNote(newNoteContent);
      setNewNoteContent('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleUpdate = async (noteId: string) => {
    if (!editContent.trim()) return;

    try {
      await onUpdateNote(noteId, editContent);
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">Notes</h3>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Note
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Add new note */}
        {isAdding && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <Textarea
              placeholder="Write your note... (Markdown supported)"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setIsAdding(false);
                  setNewNoteContent('');
                }}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes list */}
        {notes.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-400">
            No notes yet. Click "Add Note" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                {editingId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdate(note.id)}>
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={cancelEdit}>
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="prose prose-invert prose-sm max-w-none mb-3">
                      <ReactMarkdown>{note.content}</ReactMarkdown>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDateTime(note.createdAt)}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(note)}
                          className="p-1 rounded hover:bg-white/10 text-blue-400 hover:text-blue-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="p-1 rounded hover:bg-white/10 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
