import { Activity, Clock } from 'lucide-react';
import type { ActivityLogEntry } from '../types/schema';
import { getRelativeTime } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';

interface ActivityLogProps {
  activities: ActivityLogEntry[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent-400" />
          <h3 className="text-lg font-semibold text-gray-100">Activity Log</h3>
        </div>
      </CardHeader>
      <CardBody>
        {sortedActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No activity yet</div>
        ) : (
          <div className="space-y-3">
            {sortedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
