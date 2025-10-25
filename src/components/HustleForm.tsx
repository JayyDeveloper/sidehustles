import React, { useState } from 'react';
import type { CreateHustleInput, HustleStatus, Priority } from '../types/schema';
import { Input, Textarea, Select } from './Input';
import { Button } from './Button';

interface HustleFormProps {
  initialData?: Partial<CreateHustleInput>;
  onSubmit: (data: CreateHustleInput) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function HustleForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Hustle',
}: HustleFormProps) {
  const [formData, setFormData] = useState<CreateHustleInput>({
    name: initialData?.name || '',
    status: initialData?.status || 'future',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    tags: initialData?.tags || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Hustle Name"
        placeholder="e.g., Freelance Design Work"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        autoFocus
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(e) =>
          setFormData({ ...formData, status: e.target.value as HustleStatus })
        }
        options={[
          { value: 'active', label: 'Active' },
          { value: 'future', label: 'Future' },
          { value: 'archived', label: 'Archived' },
        ]}
      />

      <Select
        label="Priority"
        value={formData.priority}
        onChange={(e) =>
          setFormData({ ...formData, priority: e.target.value as Priority })
        }
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
      />

      <Textarea
        label="Description"
        placeholder="Brief description of this hustle..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={3}
      />

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" onClick={handleAddTag} variant="secondary">
            Add
          </Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-accent-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
