import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import type { Hustle } from '../types/schema';
import { HustleItem } from './HustleItem';
import { Card, CardHeader, CardBody } from './Card';
import { Button } from './Button';

interface SortableHustleProps {
  hustle: Hustle;
}

function SortableHustle({ hustle }: SortableHustleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: hustle.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <HustleItem hustle={hustle} isDragging={isDragging} dragListeners={listeners} />
    </div>
  );
}

interface HustleListProps {
  title: string;
  hustles: Hustle[];
  emptyMessage?: string;
  onReorder: (reordered: Hustle[]) => void;
  onAdd?: () => void;
}

export function HustleList({
  title,
  hustles,
  emptyMessage = 'No hustles yet',
  onReorder,
  onAdd,
}: HustleListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = hustles.findIndex((h) => h.id === active.id);
      const newIndex = hustles.findIndex((h) => h.id === over.id);

      const reordered = arrayMove(hustles, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {hustles.length} hustle{hustles.length !== 1 ? 's' : ''}
          </p>
        </div>
        {onAdd && (
          <Button onClick={onAdd} size="sm">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        )}
      </CardHeader>
      <CardBody>
        {hustles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">{emptyMessage}</p>
            {onAdd && (
              <Button onClick={onAdd} variant="secondary" className="mt-4">
                <Plus className="w-4 h-4" />
                Create your first hustle
              </Button>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={hustles.map((h) => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {hustles.map((hustle) => (
                  <SortableHustle key={hustle.id} hustle={hustle} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardBody>
    </Card>
  );
}
