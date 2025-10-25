import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Transaction } from '../types/schema';
import { formatCurrency } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';
import { TrendingUp } from 'lucide-react';

interface ChartsPanelProps {
  transactions: Transaction[];
}

interface ChartData {
  date: string;
  income: number;
  expenses: number;
  profit: number;
}

export function ChartsPanel({ transactions }: ChartsPanelProps) {
  // Group transactions by month
  const groupByMonth = (): ChartData[] => {
    const grouped = new Map<string, { income: number; expenses: number }>();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, { income: 0, expenses: 0 });
      }

      const data = grouped.get(monthKey)!;

      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else {
        data.expenses += transaction.amount;
      }
    });

    return Array.from(grouped.entries())
      .map(([date, { income, expenses }]) => ({
        date: new Date(date + '-01').toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        income,
        expenses,
        profit: income - expenses,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6); // Last 6 months
  };

  const chartData = groupByMonth();

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-400" />
            <h3 className="text-lg font-semibold text-gray-100">Profit Trends</h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12 text-gray-400">
            <p>No transaction data yet.</p>
            <p className="text-sm mt-2">Add income and expenses to see your profit trends.</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: ChartData }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-xl">
          <p className="text-sm font-medium text-gray-300 mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-xs text-green-400">
              Income: {formatCurrency(payload[0].payload.income)}
            </p>
            <p className="text-xs text-red-400">
              Expenses: {formatCurrency(payload[0].payload.expenses)}
            </p>
            <p className="text-xs text-accent-400 font-medium">
              Profit: {formatCurrency(payload[0].payload.profit)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-400" />
          <h3 className="text-lg font-semibold text-gray-100">Profit Trends</h3>
        </div>
        <p className="text-sm text-gray-400 mt-1">Last 6 months performance</p>
      </CardHeader>
      <CardBody>
        {/* Profit Line Chart */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Net Profit Over Time</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">Income vs Expenses</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
                iconType="square"
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
