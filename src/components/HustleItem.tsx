import { Link } from 'react-router-dom';
import { GripVertical, TrendingUp, DollarSign, Tag } from 'lucide-react';
import type { Hustle, Priority } from '../types/schema';
import { calculateHustleStats, formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface HustleItemProps {
  hustle: Hustle;
  isDragging?: boolean;
  dragListeners?: SyntheticListenerMap;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function HustleItem({ hustle, isDragging, dragListeners }: HustleItemProps) {
  const stats = calculateHustleStats(hustle);
  const isProfit = stats.netProfit >= 0;

  return (
    <Link
      to={`/hustle/${hustle.id}`}
      className={cn(
        'block p-4 rounded-xl border border-white/10 bg-white/5',
        'hover:bg-white/10 hover:shadow-glass-lg transition-all duration-200',
        'group',
        isDragging && 'opacity-50 shadow-2xl'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing"
          {...dragListeners}
          onClick={(e) => {
            // Prevent link navigation when clicking drag handle
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <GripVertical className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and priority */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-100 truncate">
              {hustle.name}
            </h3>
            <span
              className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-lg border',
                priorityColors[hustle.priority]
              )}
            >
              {hustle.priority}
            </span>
          </div>

          {/* Description */}
          {hustle.description && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
              {hustle.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">
                {formatCurrency(stats.totalIncome)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium">
                {formatCurrency(stats.totalExpense + stats.totalInvestment)}
              </span>
            </div>
            <div
              className={cn(
                'ml-auto px-2 py-0.5 rounded-lg font-medium',
                isProfit ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              )}
            >
              {isProfit ? '+' : ''}
              {formatCurrency(stats.netProfit)}
            </div>
          </div>

          {/* Tags */}
          {hustle.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {hustle.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {hustle.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{hustle.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
