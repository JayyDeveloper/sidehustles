import { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { Transaction, CreateTransactionInput, TransactionType } from '../types/schema';
import { formatCurrency, formatDate } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';
import { Button } from './Button';
import { Input, Select, Textarea } from './Input';

interface FinancePanelProps {
  transactions: Transaction[];
  onAddTransaction: (data: CreateTransactionInput) => Promise<void>;
  onDeleteTransaction: (transactionId: string) => Promise<void>;
}

export function FinancePanel({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}: FinancePanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CreateTransactionInput>({
    amount: 0,
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  // Calculate totals
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else if (t.type === 'expense') acc.expense += t.amount;
      else if (t.type === 'investment') acc.investment += t.amount;
      return acc;
    },
    { income: 0, expense: 0, investment: 0 }
  );

  const netProfit = totals.income - totals.expense - totals.investment;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.amount <= 0) {
      return;
    }

    try {
      await onAddTransaction(formData);
      setFormData({
        amount: 0,
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'expense':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'investment':
        return <DollarSign className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'text-green-400';
      case 'expense':
        return 'text-red-400';
      case 'investment':
        return 'text-blue-400';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">Finance</h3>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-gray-400 mb-1">Income</p>
            <p className="text-lg font-bold text-green-400">
              {formatCurrency(totals.income)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-gray-400 mb-1">Expenses</p>
            <p className="text-lg font-bold text-red-400">
              {formatCurrency(totals.expense)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-gray-400 mb-1">Investment</p>
            <p className="text-lg font-bold text-blue-400">
              {formatCurrency(totals.investment)}
            </p>
          </div>
          <div
            className={`p-3 rounded-xl ${
              netProfit >= 0
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            <p className="text-xs text-gray-400 mb-1">Net Profit</p>
            <p
              className={`text-lg font-bold ${
                netProfit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(netProfit)}
            </p>
          </div>
        </div>

        {/* Add transaction form */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                required
                autoFocus
              />
              <Select
                label="Type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as TransactionType })
                }
                options={[
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                  { value: 'investment', label: 'Investment' },
                ]}
              />
            </div>
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Textarea
              label="Note (optional)"
              placeholder="Add a note about this transaction..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={2}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Add Transaction
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setIsAdding(false);
                  setFormData({
                    amount: 0,
                    type: 'income',
                    date: new Date().toISOString().split('T')[0],
                    note: '',
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Transactions list */}
        {transactions.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-400">
            No transactions yet. Click "Add Transaction" to create one.
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Transactions</h4>
            {transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getTransactionIcon(transaction.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-300 capitalize">
                          {transaction.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                      {transaction.note && (
                        <p className="text-xs text-gray-400 truncate">
                          {transaction.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${getTransactionColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
