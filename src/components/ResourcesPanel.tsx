import { useState } from 'react';
import { Plus, ExternalLink, Trash2, Link as LinkIcon } from 'lucide-react';
import type { Resource, CreateResourceInput } from '../types/schema';
import { formatDate } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';
import { Button } from './Button';
import { Input, Textarea } from './Input';

interface ResourcesPanelProps {
  resources: Resource[];
  onAddResource: (data: CreateResourceInput) => Promise<void>;
  onDeleteResource: (resourceId: string) => Promise<void>;
}

export function ResourcesPanel({
  resources,
  onAddResource,
  onDeleteResource,
}: ResourcesPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CreateResourceInput>({
    title: '',
    url: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      return;
    }

    try {
      await onAddResource(formData);
      setFormData({ title: '', url: '', description: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add resource:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">Resources</h3>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Resource
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Add new resource form */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
          >
            <Input
              label="Title"
              placeholder="e.g., Design Resources"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              autoFocus
            />
            <Input
              label="URL"
              type="url"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
            <Textarea
              label="Description (optional)"
              placeholder="Brief description of this resource..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Add Resource
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setIsAdding(false);
                  setFormData({ title: '', url: '', description: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Resources list */}
        {resources.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-400">
            No resources yet. Click "Add Resource" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <LinkIcon className="w-4 h-4 text-accent-400 flex-shrink-0" />
                      <h4 className="font-medium text-gray-100 truncate">
                        {resource.title}
                      </h4>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent-400 hover:text-accent-300 flex items-center gap-1 mb-2 break-all"
                    >
                      <span className="truncate">{resource.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                    {resource.description && (
                      <p className="text-sm text-gray-400 mb-2">
                        {resource.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Added {formatDate(resource.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteResource(resource.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Delete resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
