import { useState } from 'react';
import { Plus, Target, Trash2, Check } from 'lucide-react';
import type { Goal, CreateGoalInput } from '../types/schema';
import { formatCurrency, formatDate } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface GoalsPanelProps {
  goals: Goal[];
  onAddGoal: (data: CreateGoalInput) => Promise<void>;
  onDeleteGoal: (goalId: string) => Promise<void>;
}

export function GoalsPanel({ goals, onAddGoal, onDeleteGoal }: GoalsPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CreateGoalInput>({
    title: '',
    targetAmount: 0,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || formData.targetAmount <= 0) {
      return;
    }

    try {
      await onAddGoal(formData);
      setFormData({
        title: '',
        targetAmount: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  const calculateProgress = (goal: Goal): number => {
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  };

  const isOverdue = (deadline: string): boolean => {
    return new Date(deadline) < new Date();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Financial Goals</h3>
          <p className="text-sm text-gray-400 mt-1">
            {goals.filter((g) => g.completed).length} of {goals.length} completed
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Add new goal form */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
          >
            <Input
              label="Goal Title"
              placeholder="e.g., Make $500 this month"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              autoFocus
            />
            <Input
              label="Target Amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="500"
              value={formData.targetAmount || ''}
              onChange={(e) =>
                setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })
              }
              required
            />
            <Input
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Add Goal
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setIsAdding(false);
                  setFormData({
                    title: '',
                    targetAmount: 0,
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split('T')[0],
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Goals list */}
        {goals.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-400">
            No goals yet. Click "Add Goal" to set your first financial target.
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const progress = calculateProgress(goal);
              const overdue = isOverdue(goal.deadline);

              return (
                <div
                  key={goal.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    goal.completed
                      ? 'bg-green-500/10 border-green-500/20'
                      : overdue
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {goal.completed ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center">
                          <Target className="w-4 h-4 text-accent-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-100">{goal.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Due {formatDate(goal.deadline)}
                          {overdue && !goal.completed && (
                            <span className="ml-2 text-red-400">(Overdue)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                      aria-label="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-medium text-gray-300">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          goal.completed
                            ? 'bg-green-500'
                            : progress >= 75
                            ? 'bg-accent-500'
                            : 'bg-accent-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right">{progress.toFixed(0)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
