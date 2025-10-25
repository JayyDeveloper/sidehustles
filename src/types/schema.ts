/**
 * Core data types and schema for Hustleboard
 */

export type HustleStatus = 'active' | 'future' | 'archived';

export type Priority = 'low' | 'medium' | 'high';

export type TransactionType = 'income' | 'expense' | 'investment';

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  type: 'created' | 'updated' | 'status_changed' | 'transaction_added' | 'resource_added' | 'note_added';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Hustle {
  id: string;
  name: string;
  status: HustleStatus;
  description: string;
  notes: Note[];
  resources: Resource[];
  transactions: Transaction[];
  activityLog: ActivityLogEntry[];
  createdAt: string;
  updatedAt: string;
  priority: Priority;
  tags: string[];
  order: number; // For drag-and-drop ordering within lists
}

export interface HustleStats {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  netProfit: number;
  transactionCount: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultView: 'dashboard' | 'list';
  notifications: boolean;
}

// Input types for creating/updating
export interface CreateHustleInput {
  name: string;
  status?: HustleStatus;
  description?: string;
  priority?: Priority;
  tags?: string[];
}

export interface UpdateHustleInput {
  name?: string;
  status?: HustleStatus;
  description?: string;
  priority?: Priority;
  tags?: string[];
}

export interface CreateNoteInput {
  content: string;
}

export interface CreateResourceInput {
  title: string;
  url: string;
  description?: string;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
}

// Filter and search types
export interface HustleFilter {
  status?: HustleStatus[];
  priority?: Priority[];
  tags?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Sync types (for future API integration)
export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'hustle' | 'note' | 'resource' | 'transaction';
  entityId: string;
  data: unknown;
  timestamp: string;
  synced: boolean;
}

// Export/Import types
export interface ExportData {
  version: string;
  exportDate: string;
  hustles: Hustle[];
  settings: AppSettings;
}

// Utility types
export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}
