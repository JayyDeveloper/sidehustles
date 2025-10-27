import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Hustle, AppSettings, SyncQueueItem, OptionTrade } from '../types/schema';

/**
 * IndexedDB schema definition
 */
interface HustleboardDB extends DBSchema {
  hustles: {
    key: string;
    value: Hustle;
    indexes: {
      'by-status': string;
      'by-priority': string;
      'by-createdAt': string;
      'by-order': number;
    };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
  syncQueue: {
    key: string;
    value: SyncQueueItem;
    indexes: {
      'by-synced': number;
      'by-timestamp': string;
    };
  };
  options: {
    key: string;
    value: OptionTrade;
    indexes: {
      'by-status': string;
      'by-symbol': string;
      'by-expiration': string;
    };
  };
}

const DB_NAME = 'hustleboard-db';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<HustleboardDB> | null = null;

/**
 * Initialize the database with proper schema and indexes
 */
export async function initDB(): Promise<IDBPDatabase<HustleboardDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<HustleboardDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);

      // Version 1: Initial schema
      if (oldVersion < 1) {
        // Create hustles store
        const hustleStore = db.createObjectStore('hustles', { keyPath: 'id' });
        hustleStore.createIndex('by-status', 'status');
        hustleStore.createIndex('by-priority', 'priority');
        hustleStore.createIndex('by-createdAt', 'createdAt');
        hustleStore.createIndex('by-order', 'order');

        // Create settings store
        db.createObjectStore('settings', { keyPath: 'id' });

        // Create sync queue store
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('by-synced', 'synced');
        syncStore.createIndex('by-timestamp', 'timestamp');
      }

      // Version 2: Add options trading
      if (oldVersion < 2) {
        const optionsStore = db.createObjectStore('options', { keyPath: 'id' });
        optionsStore.createIndex('by-status', 'status');
        optionsStore.createIndex('by-symbol', 'symbol');
        optionsStore.createIndex('by-expiration', 'expiration');
      }
    },
    blocked() {
      console.warn('Database upgrade blocked - please close other tabs');
    },
    blocking() {
      console.warn('Database blocking upgrade in another tab');
      // Close the database to allow the upgrade to proceed
      if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
      }
    },
    terminated() {
      console.error('Database connection terminated unexpectedly');
      dbInstance = null;
    },
  });

  return dbInstance;
}

/**
 * Get database instance
 */
export async function getDB(): Promise<IDBPDatabase<HustleboardDB>> {
  if (!dbInstance) {
    return await initDB();
  }
  return dbInstance;
}

/**
 * Close database connection
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

/**
 * CRUD operations for Hustles
 */
export const hustleDB = {
  async getAll(): Promise<Hustle[]> {
    const db = await getDB();
    const hustles = await db.getAll('hustles');
    console.log('📖 DB.getAll returned', hustles.length, 'hustles');
    hustles.forEach(h => {
      console.log(`📖   - ${h.id}: ${h.transactions.length} transactions, ${h.activityLog.length} activities`);
    });
    return hustles;
  },

  async getById(id: string): Promise<Hustle | undefined> {
    const db = await getDB();
    return await db.get('hustles', id);
  },

  async getByStatus(status: string): Promise<Hustle[]> {
    const db = await getDB();
    return await db.getAllFromIndex('hustles', 'by-status', status);
  },

  async add(hustle: Hustle): Promise<string> {
    const db = await getDB();
    return await db.add('hustles', hustle);
  },

  async update(hustle: Hustle): Promise<string> {
    const db = await getDB();
    console.log('💾 DB.update called for hustle:', hustle.id, 'transactions:', hustle.transactions.length, 'activities:', hustle.activityLog.length);
    const result = await db.put('hustles', hustle);
    console.log('💾 DB.update completed, key:', result);
    // Verify it was actually saved
    const saved = await db.get('hustles', hustle.id);
    console.log('💾 DB.update verified - saved transactions:', saved?.transactions.length, 'saved activities:', saved?.activityLog.length);
    return result;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('hustles', id);
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('hustles');
  },
};

/**
 * Settings operations
 */
export const settingsDB = {
  async get(): Promise<AppSettings | undefined> {
    const db = await getDB();
    return await db.get('settings', 'app-settings');
  },

  async set(settings: AppSettings): Promise<void> {
    const db = await getDB();
    await db.put('settings', { ...settings, id: 'app-settings' } as never);
  },
};

/**
 * Sync queue operations (for future API integration)
 */
export const syncQueueDB = {
  async getAll(): Promise<SyncQueueItem[]> {
    const db = await getDB();
    return await db.getAll('syncQueue');
  },

  async getUnsynced(): Promise<SyncQueueItem[]> {
    const db = await getDB();
    return await db.getAllFromIndex('syncQueue', 'by-synced', 0);
  },

  async add(item: SyncQueueItem): Promise<string> {
    const db = await getDB();
    return await db.add('syncQueue', item);
  },

  async markSynced(id: string): Promise<void> {
    const db = await getDB();
    const item = await db.get('syncQueue', id);
    if (item) {
      item.synced = true;
      await db.put('syncQueue', item);
    }
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('syncQueue');
  },
};

/**
 * Options trading operations
 */
export const optionsDB = {
  async getAll(): Promise<OptionTrade[]> {
    const db = await getDB();
    return await db.getAll('options');
  },

  async getById(id: string): Promise<OptionTrade | undefined> {
    const db = await getDB();
    return await db.get('options', id);
  },

  async getByStatus(status: string): Promise<OptionTrade[]> {
    const db = await getDB();
    return await db.getAllFromIndex('options', 'by-status', status);
  },

  async add(option: OptionTrade): Promise<string> {
    const db = await getDB();
    return await db.add('options', option);
  },

  async update(option: OptionTrade): Promise<string> {
    const db = await getDB();
    return await db.put('options', option);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('options', id);
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('options');
  },
};

/**
 * Export all data
 */
export async function exportData(): Promise<{ hustles: Hustle[]; settings: AppSettings | undefined }> {
  const hustles = await hustleDB.getAll();
  const settings = await settingsDB.get();
  return { hustles, settings };
}

/**
 * Import data (replaces existing data)
 */
export async function importData(data: {
  hustles?: Hustle[];
  settings?: AppSettings;
}): Promise<void> {
  if (data.hustles) {
    // Clear existing hustles
    await hustleDB.clear();
    // Import new hustles
    for (const hustle of data.hustles) {
      await hustleDB.add(hustle);
    }
  }

  if (data.settings) {
    await settingsDB.set(data.settings);
  }
}
