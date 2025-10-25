import { Flame, Trophy, Calendar } from 'lucide-react';
import type { StreakData } from '../types/schema';
import { formatDate } from '../lib/utils';
import { Card, CardBody } from './Card';
import { Button } from './Button';

interface StreakCounterProps {
  streakData: StreakData;
  onLogWork: () => Promise<void>;
}

export function StreakCounter({ streakData, onLogWork }: StreakCounterProps) {
  const today = new Date().toISOString().split('T')[0];
  const workedToday = streakData.workDates.includes(today);

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Work Streak</h3>
          {!workedToday && (
            <Button size="sm" onClick={onLogWork}>
              <Flame className="w-4 h-4" />
              Log Work Today
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Current Streak */}
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <p className="text-3xl font-bold text-orange-400">{streakData.currentStreak}</p>
            <p className="text-xs text-gray-400 mt-1">Current Streak</p>
            {workedToday && (
              <p className="text-xs text-green-400 mt-1">✓ Logged today!</p>
            )}
          </div>

          {/* Longest Streak */}
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-3xl font-bold text-yellow-400">{streakData.longestStreak}</p>
            <p className="text-xs text-gray-400 mt-1">Best Streak</p>
          </div>

          {/* Total Days */}
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-3xl font-bold text-blue-400">{streakData.workDates.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total Days</p>
          </div>
        </div>

        {streakData.lastWorkedOn && (
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400">
              Last worked: <span className="text-gray-300 font-medium">{formatDate(streakData.lastWorkedOn)}</span>
            </p>
          </div>
        )}

        {/* Streak tips */}
        {!workedToday && streakData.currentStreak > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <p className="text-sm text-accent-400">
              💡 Don't break your {streakData.currentStreak}-day streak! Log some work today to keep it going.
            </p>
          </div>
        )}

        {streakData.currentStreak === 0 && streakData.workDates.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-400">
              🔥 Start a new streak! Your best was {streakData.longestStreak} days.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
