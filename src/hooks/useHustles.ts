import { useState, useEffect, useCallback } from 'react';
import type {
  Hustle,
  CreateHustleInput,
  UpdateHustleInput,
  HustleStatus,
  Note,
  Resource,
  Transaction,
  CreateNoteInput,
  CreateResourceInput,
  CreateTransactionInput,
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
    reload: loadHustles,
  };
}
