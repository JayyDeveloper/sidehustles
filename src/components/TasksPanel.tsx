import { useState } from 'react';
import { Plus, Check, X, Trash2 } from 'lucide-react';
import type { Task, CreateTaskInput } from '../types/schema';
import { formatDate } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface TasksPanelProps {
  tasks: Task[];
  onAddTask: (data: CreateTaskInput) => Promise<void>;
  onToggleTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export function TasksPanel({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TasksPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      return;
    }

    try {
      await onAddTask({ title: newTaskTitle });
      setNewTaskTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Tasks</h3>
          <p className="text-sm text-gray-400 mt-1">
            {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Add new task */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <Input
              placeholder="e.g., Design logo, Send invoice..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
            />
            <Button type="submit" size="sm">
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setIsAdding(false);
                setNewTaskTitle('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* Tasks list */}
        {tasks.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-400">
            No tasks yet. Click "Add Task" to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {/* Pending tasks */}
            {pendingTasks.length > 0 && (
              <>
                <h4 className="text-sm font-medium text-gray-400">Pending</h4>
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-400 hover:border-accent-400 transition-colors"
                      aria-label="Mark as complete"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Added {formatDate(task.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="flex-shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* Completed tasks */}
            {completedTasks.length > 0 && (
              <>
                <h4 className="text-sm font-medium text-gray-400 mt-4">Completed</h4>
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group opacity-60"
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="flex-shrink-0 w-5 h-5 rounded border-2 border-accent-500 bg-accent-500 flex items-center justify-center hover:bg-accent-600 transition-colors"
                      aria-label="Mark as incomplete"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400 line-through">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Completed {task.completedAt ? formatDate(task.completedAt) : 'recently'}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="flex-shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
