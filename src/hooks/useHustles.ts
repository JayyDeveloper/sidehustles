import { useState, useEffect, useCallback } from 'react';
import type {
  Hustle,
  CreateHustleInput,
  UpdateHustleInput,
  HustleStatus,
  Note,
  Resource,
  Transaction,
  Task,
  Goal,
  CreateNoteInput,
  CreateResourceInput,
  CreateTransactionInput,
  CreateTaskInput,
  CreateGoalInput,
  ActivityLogEntry,
} from '../types/schema';
import { hustleDB } from '../lib/db';
import { generateId } from '../lib/utils';

export function useHustles() {
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all hustles from IndexedDB
  const loadHustles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hustleDB.getAll();
      // Sort by order
      data.sort((a, b) => a.order - b.order);
      setHustles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hustles');
      console.error('Error loading hustles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadHustles();
  }, [loadHustles]);

  // Create activity log entry
  const createActivityLog = (
    type: ActivityLogEntry['type'],
    description: string,
    metadata?: Record<string, unknown>
  ): ActivityLogEntry => {
    return {
      id: generateId(),
      type,
      description,
      timestamp: new Date().toISOString(),
      metadata,
    };
  };

  // Create a new hustle
  const createHustle = useCallback(
    async (input: CreateHustleInput): Promise<Hustle> => {
      const now = new Date().toISOString();
      const maxOrder = hustles.reduce((max, h) => Math.max(max, h.order), 0);

      const newHustle: Hustle = {
        id: generateId(),
        name: input.name,
        status: input.status || 'future',
        description: input.description || '',
        notes: [],
        resources: [],
        transactions: [],
        tasks: [],
        goals: [],
        streakData: {
          currentStreak: 0,
          longestStreak: 0,
          lastWorkedOn: '',
          workDates: [],
        },
        activityLog: [createActivityLog('created', `Hustle "${input.name}" created`)],
        createdAt: now,
        updatedAt: now,
        priority: input.priority || 'medium',
        tags: input.tags || [],
        order: maxOrder + 1,
      };

      await hustleDB.add(newHustle);
      await loadHustles();
      return newHustle;
    },
    [hustles, loadHustles]
  );

  // Update a hustle
  const updateHustle = useCallback(
    async (id: string, input: UpdateHustleInput): Promise<Hustle | null> => {
      const hustle = hustles.find((h) => h.id === id);
      if (!hustle) return null;

      const changes: string[] = [];
      if (input.name && input.name !== hustle.name) changes.push(`name changed to "${input.name}"`);
      if (input.status && input.status !== hustle.status) changes.push(`status changed to ${input.status}`);
      if (input.priority && input.priority !== hustle.priority) changes.push(`priority changed to ${input.priority}`);

      const updatedHustle: Hustle = {
        ...hustle,
        ...input,
        updatedAt: new Date().toISOString(),
        activityLog: [
          ...hustle.activityLog,
          ...(changes.length > 0
            ? [createActivityLog('updated', `Updated: ${changes.join(', ')}`)]
            : []),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
      return updatedHustle;
    },
    [hustles, loadHustles]
  );

  // Delete a hustle
  const deleteHustle = useCallback(
    async (id: string): Promise<void> => {
      await hustleDB.delete(id);
      await loadHustles();
    },
    [loadHustles]
  );

  // Change hustle status
  const changeStatus = useCallback(
    async (id: string, newStatus: HustleStatus): Promise<Hustle | null> => {
      const hustle = hustles.find((h) => h.id === id);
      if (!hustle) return null;

      const updatedHustle: Hustle = {
        ...hustle,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        activityLog: [
          ...hustle.activityLog,
          createActivityLog('status_changed', `Status changed from ${hustle.status} to ${newStatus}`),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
      return updatedHustle;
    },
    [hustles, loadHustles]
  );

  // Add a note
  const addNote = useCallback(
    async (hustleId: string, input: CreateNoteInput): Promise<Note | null> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return null;

      const now = new Date().toISOString();
      const newNote: Note = {
        id: generateId(),
        content: input.content,
        createdAt: now,
        updatedAt: now,
      };

      const updatedHustle: Hustle = {
        ...hustle,
        notes: [...hustle.notes, newNote],
        updatedAt: now,
        activityLog: [
          ...hustle.activityLog,
          createActivityLog('note_added', 'New note added'),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
      return newNote;
    },
    [hustles, loadHustles]
  );

  // Update a note
  const updateNote = useCallback(
    async (hustleId: string, noteId: string, content: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      const updatedNotes = hustle.notes.map((note) =>
        note.id === noteId ? { ...note, content, updatedAt: new Date().toISOString() } : note
      );

      const updatedHustle: Hustle = {
        ...hustle,
        notes: updatedNotes,
        updatedAt: new Date().toISOString(),
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  // Delete a note
  const deleteNote = useCallback(
    async (hustleId: string, noteId: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      const updatedHustle: Hustle = {
        ...hustle,
        notes: hustle.notes.filter((note) => note.id !== noteId),
        updatedAt: new Date().toISOString(),
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  // Add a resource
  const addResource = useCallback(
    async (hustleId: string, input: CreateResourceInput): Promise<Resource | null> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return null;

      const newResource: Resource = {
        id: generateId(),
        title: input.title,
        url: input.url,
        description: input.description,
        createdAt: new Date().toISOString(),
      };

      const updatedHustle: Hustle = {
        ...hustle,
        resources: [...hustle.resources, newResource],
        updatedAt: new Date().toISOString(),
        activityLog: [
          ...hustle.activityLog,
          createActivityLog('resource_added', `Resource "${input.title}" added`),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
      return newResource;
    },
    [hustles, loadHustles]
  );

  // Delete a resource
  const deleteResource = useCallback(
    async (hustleId: string, resourceId: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      const updatedHustle: Hustle = {
        ...hustle,
        resources: hustle.resources.filter((resource) => resource.id !== resourceId),
        updatedAt: new Date().toISOString(),
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  // Add a transaction
  const addTransaction = useCallback(
    async (hustleId: string, input: CreateTransactionInput): Promise<Transaction | null> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return null;

      const newTransaction: Transaction = {
        id: generateId(),
        amount: input.amount,
        type: input.type,
        date: input.date,
        note: input.note,
        createdAt: new Date().toISOString(),
      };

      const updatedHustle: Hustle = {
        ...hustle,
        transactions: [...hustle.transactions, newTransaction],
        updatedAt: new Date().toISOString(),
        activityLog: [
          ...hustle.activityLog,
          createActivityLog(
            'transaction_added',
            `${input.type} of $${input.amount} added`,
            { amount: input.amount, type: input.type }
          ),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
      return newTransaction;
    },
    [hustles, loadHustles]
  );

  // Delete a transaction
  const deleteTransaction = useCallback(
    async (hustleId: string, transactionId: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      const updatedHustle: Hustle = {
        ...hustle,
        transactions: hustle.transactions.filter((transaction) => transaction.id !== transactionId),
        updatedAt: new Date().toISOString(),
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  // Duplicate a hustle
  const duplicateHustle = useCallback(
    async (id: string): Promise<Hustle | null> => {
      const hustle = hustles.find((h) => h.id === id);
      if (!hustle) return null;

      const now = new Date().toISOString();
      const maxOrder = hustles.reduce((max, h) => Math.max(max, h.order), 0);

      const duplicated: Hustle = {
        ...hustle,
        id: generateId(),
        name: `${hustle.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
        order: maxOrder + 1,
        activityLog: [createActivityLog('created', `Duplicated from "${hustle.name}"`)],
      };

      await hustleDB.add(duplicated);
      await loadHustles();
      return duplicated;
    },
    [hustles, loadHustles]
  );

  // Reorder hustles
  const reorderHustles = useCallback(
    async (reorderedHustles: Hustle[]): Promise<void> => {
      // Update order for each hustle
      const updates = reorderedHustles.map((hustle, index) => ({
        ...hustle,
        order: index,
        updatedAt: new Date().toISOString(),
      }));

      // Save all updates
      await Promise.all(updates.map((hustle) => hustleDB.update(hustle)));
      await loadHustles();
    },
    [loadHustles]
  );

  // Add a task
  const addTask = useCallback(
    async (hustleId: string, input: CreateTaskInput): Promise<Task | null> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return null;

      const now = new Date().toISOString();
      const newTask: Task = {
        id: generateId(),
        title: input.title,
        completed: false,
        createdAt: now,
      };

      const updatedHustle: Hustle = {
        ...hustle,
        tasks: [...hustle.tasks, newTask],
        updatedAt: now,
        activityLog: [
          ...hustle.activityLog,
          createActivityLog('task_added', `Task "${input.title}" added`),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
      return newTask;
    },
    [hustles, loadHustles]
  );

  // Toggle task completion
  const toggleTask = useCallback(
    async (hustleId: string, taskId: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      const now = new Date().toISOString();
      const updatedTasks = hustle.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? now : undefined,
            }
          : task
      );

      const task = hustle.tasks.find((t) => t.id === taskId);
      const updatedHustle: Hustle = {
        ...hustle,
        tasks: updatedTasks,
        updatedAt: now,
        activityLog: [
          ...hustle.activityLog,
          createActivityLog(
            'task_completed',
            task ? `Task "${task.title}" ${task.completed ? 'reopened' : 'completed'}` : 'Task updated'
          ),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  // Delete a task
  const deleteTask = useCallback(
    async (hustleId: string, taskId: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      const updatedHustle: Hustle = {
        ...hustle,
        tasks: hustle.tasks.filter((task) => task.id !== taskId),
        updatedAt: new Date().toISOString(),
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  // Add a goal
  const addGoal = useCallback(
    async (hustleId: string, input: CreateGoalInput): Promise<Goal | null> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return null;

      const now = new Date().toISOString();
      const newGoal: Goal = {
        id: generateId(),
        title: input.title,
        targetAmount: input.targetAmount,
        currentAmount: 0,
        deadline: input.deadline,
        createdAt: now,
        completed: false,
      };

      const updatedHustle: Hustle = {
        ...hustle,
        goals: [...hustle.goals, newGoal],
        updatedAt: now,
        activityLog: [
          ...hustle.activityLog,
          createActivityLog('goal_added', `Goal "${input.title}" added with target of $${input.targetAmount}`),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
      return newGoal;
    },
    [hustles, loadHustles]
  );

  // Update goal progress (called when transactions are added)
  const updateGoalProgress = useCallback(
    async (hustleId: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      // Calculate total income for current goals
      const totalIncome = hustle.transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const updatedGoals = hustle.goals.map((goal) => ({
        ...goal,
        currentAmount: totalIncome,
        completed: totalIncome >= goal.targetAmount,
      }));

      const updatedHustle: Hustle = {
        ...hustle,
        goals: updatedGoals,
        updatedAt: new Date().toISOString(),
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  // Delete a goal
  const deleteGoal = useCallback(
    async (hustleId: string, goalId: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      const updatedHustle: Hustle = {
        ...hustle,
        goals: hustle.goals.filter((goal) => goal.id !== goalId),
        updatedAt: new Date().toISOString(),
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  // Update streak (called when work is logged)
  const updateStreak = useCallback(
    async (hustleId: string): Promise<void> => {
      const hustle = hustles.find((h) => h.id === hustleId);
      if (!hustle) return;

      const today = new Date().toISOString().split('T')[0];
      const { workDates } = hustle.streakData;

      // Don't update if already worked today
      if (workDates.includes(today)) return;

      const newWorkDates = [...workDates, today];

      // Calculate streak
      let currentStreak = 1;
      const sortedDates = [...newWorkDates].sort().reverse();

      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        const previousDate = new Date(sortedDates[i - 1]);
        const diffDays = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      const longestStreak = Math.max(hustle.streakData.longestStreak, currentStreak);

      const updatedHustle: Hustle = {
        ...hustle,
        streakData: {
          currentStreak,
          longestStreak,
          lastWorkedOn: today,
          workDates: newWorkDates,
        },
        updatedAt: new Date().toISOString(),
        activityLog: [
          ...hustle.activityLog,
          createActivityLog('streak_updated', `Streak updated: ${currentStreak} days`),
        ],
      };

      await hustleDB.update(updatedHustle);
      await loadHustles();
    },
    [hustles, loadHustles]
  );

  return {
    hustles,
    loading,
    error,
    createHustle,
    updateHustle,
    deleteHustle,
    changeStatus,
    addNote,
    updateNote,
    deleteNote,
    addResource,
    deleteResource,
    addTransaction,
    deleteTransaction,
    duplicateHustle,
    reorderHustles,
    addTask,
    toggleTask,
    deleteTask,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    updateStreak,
    reload: loadHustles,
  };
}
