import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import type { Hustle } from '../types/schema';
import { calculateTotalStats, formatCurrency } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';

interface AnalyticsProps {
  hustles: Hustle[];
}

export function Analytics({ hustles }: AnalyticsProps) {
  const stats = calculateTotalStats(hustles);
  const isProfit = stats.netProfit >= 0;

  const metrics = [
    {
      label: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(stats.totalExpense),
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Total Investment',
      value: formatCurrency(stats.totalInvestment),
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Net Profit',
      value: formatCurrency(stats.netProfit),
      icon: Activity,
      color: isProfit ? 'text-green-400' : 'text-red-400',
      bgColor: isProfit ? 'bg-green-500/10' : 'bg-red-500/10',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-100">Analytics Overview</h2>
        <p className="text-sm text-gray-400 mt-1">
          Financial summary across {hustles.length} hustle{hustles.length !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`p-4 rounded-xl border border-white/10 ${metric.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{metric.label}</span>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {stats.transactionCount > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-400">
              Total Transactions: <span className="font-medium text-gray-300">{stats.transactionCount}</span>
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
