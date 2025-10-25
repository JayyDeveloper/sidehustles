import type { Hustle, HustleStats } from '../types/schema';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate statistics for a hustle
 */
export function calculateHustleStats(hustle: Hustle): HustleStats {
  const stats: HustleStats = {
    totalIncome: 0,
    totalExpense: 0,
    totalInvestment: 0,
    netProfit: 0,
    transactionCount: hustle.transactions.length,
  };

  hustle.transactions.forEach((transaction) => {
    switch (transaction.type) {
      case 'income':
        stats.totalIncome += transaction.amount;
        break;
      case 'expense':
        stats.totalExpense += transaction.amount;
        break;
      case 'investment':
        stats.totalInvestment += transaction.amount;
        break;
    }
  });

  stats.netProfit = stats.totalIncome - stats.totalExpense - stats.totalInvestment;

  return stats;
}

/**
 * Calculate aggregate statistics across all hustles
 */
export function calculateTotalStats(hustles: Hustle[]): HustleStats {
  const totalStats: HustleStats = {
    totalIncome: 0,
    totalExpense: 0,
    totalInvestment: 0,
    netProfit: 0,
    transactionCount: 0,
  };

  hustles.forEach((hustle) => {
    const stats = calculateHustleStats(hustle);
    totalStats.totalIncome += stats.totalIncome;
    totalStats.totalExpense += stats.totalExpense;
    totalStats.totalInvestment += stats.totalInvestment;
    totalStats.transactionCount += stats.transactionCount;
  });

  totalStats.netProfit = totalStats.totalIncome - totalStats.totalExpense - totalStats.totalInvestment;

  return totalStats;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Class name helper (simple version)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
