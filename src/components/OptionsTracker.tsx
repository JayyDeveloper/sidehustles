import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Check, X, Trash2 } from 'lucide-react';
import type { OptionTrade, CreateOptionTradeInput, OptionStatus, OptionType } from '../types/schema';
import { optionsDB } from '../lib/db';
import { generateId, formatCurrency, formatDate } from '../lib/utils';
import { Card, CardHeader, CardBody } from './Card';
import { Button } from './Button';
import { Input, Select } from './Input';

export function OptionsTracker() {
  const [options, setOptions] = useState<OptionTrade[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateOptionTradeInput>({
    symbol: '',
    strike: 0,
    expiration: '',
    type: 'call',
    premium: 0,
    quantity: 1,
    notes: '',
  });

  const loadOptions = async () => {
    const data = await optionsDB.getAll();
    setOptions(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();
    const newOption: OptionTrade = {
      id: generateId(),
      ...formData,
      symbol: formData.symbol.toUpperCase(),
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };

    await optionsDB.add(newOption);
    await loadOptions();

    setFormData({
      symbol: '',
      strike: 0,
      expiration: '',
      type: 'call',
      premium: 0,
      quantity: 1,
      notes: '',
    });
    setIsAdding(false);
  };

  const handleUpdateStatus = async (id: string, status: OptionStatus, assignedShares?: number, assignmentPrice?: number, closedPrice?: number) => {
    const option = options.find((o) => o.id === id);
    if (!option) return;

    const updated: OptionTrade = {
      ...option,
      status,
      assignedShares,
      assignmentPrice,
      closedPrice,
      updatedAt: new Date().toISOString(),
    };

    await optionsDB.update(updated);
    await loadOptions();
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this option trade?')) {
      await optionsDB.delete(id);
      await loadOptions();
    }
  };

  const calculateStats = () => {
    const totalPremium = options.reduce((sum, opt) => sum + (opt.premium * opt.quantity * 100), 0);
    const openPositions = options.filter((opt) => opt.status === 'open').length;
    const closedProfit = options
      .filter((opt) => opt.status === 'closed' && opt.closedPrice)
      .reduce((sum, opt) => sum + ((opt.premium - opt.closedPrice!) * opt.quantity * 100), 0);
    const assignedValue = options
      .filter((opt) => opt.status === 'assigned')
      .reduce((sum, opt) => sum + ((opt.assignmentPrice || 0) * (opt.assignedShares || 0)), 0);

    return { totalPremium, openPositions, closedProfit, assignedValue };
  };

  const stats = calculateStats();

  const getStatusColor = (status: OptionStatus) => {
    switch (status) {
      case 'open':
        return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'closed':
        return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20';
      case 'assigned':
        return 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'expired':
        return 'text-gray-600 dark:text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Options Trading Tracker</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your options positions and profit</p>
        </div>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Trade
        </Button>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Premium Collected</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(stats.totalPremium)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Open Positions</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.openPositions}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Closed Profit</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {formatCurrency(stats.closedProfit)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Assigned Value</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(stats.assignedValue)}
            </p>
          </div>
        </div>

        {/* Add Trade Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Symbol"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL"
                required
                autoFocus
              />
              <Input
                label="Strike Price"
                type="number"
                step="0.01"
                value={formData.strike || ''}
                onChange={(e) => setFormData({ ...formData, strike: parseFloat(e.target.value) || 0 })}
                placeholder="150.00"
                required
              />
              <Input
                label="Expiration"
                type="date"
                value={formData.expiration}
                onChange={(e) => setFormData({ ...formData, expiration: e.target.value })}
                required
              />
              <Select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as OptionType })}
                options={[
                  { value: 'call', label: 'Call' },
                  { value: 'put', label: 'Put' },
                ]}
              />
              <Input
                label="Premium (per share)"
                type="number"
                step="0.01"
                value={formData.premium || ''}
                onChange={(e) => setFormData({ ...formData, premium: parseFloat(e.target.value) || 0 })}
                placeholder="2.50"
                required
              />
              <Input
                label="Contracts"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <Input
              label="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Covered call on existing shares..."
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">Add Trade</Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </form>
        )}

        {/* Options List */}
        {options.length === 0 && !isAdding ? (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No option trades yet. Add your first trade to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {options.map((option) => {
              const totalPremium = option.premium * option.quantity * 100;
              const costBasis = option.status === 'assigned' && option.assignmentPrice
                ? option.assignmentPrice - option.premium
                : null;

              return (
                <div
                  key={option.id}
                  className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-accent-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {option.symbol}
                        </h3>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          ${option.strike} {option.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(option.status)}`}>
                          {option.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Expires: {formatDate(option.expiration)} • {option.quantity} contract{option.quantity > 1 ? 's' : ''}
                      </p>
                      {option.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">{option.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(option.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 dark:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Premium</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        +{formatCurrency(totalPremium)}
                      </p>
                    </div>
                    {option.status === 'assigned' && costBasis && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Cost Basis</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          ${costBasis.toFixed(2)}/share
                        </p>
                      </div>
                    )}
                    {option.status === 'assigned' && option.assignedShares && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Shares</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {option.assignedShares}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {option.status === 'open' && editingId !== option.id && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(option.id, 'closed')}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20 transition-colors"
                      >
                        <Check className="w-3 h-3 inline mr-1" />
                        Mark Closed
                      </button>
                      <button
                        onClick={() => setEditingId(option.id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 transition-colors"
                      >
                        Mark Assigned
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(option.id, 'expired')}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/20 transition-colors"
                      >
                        <X className="w-3 h-3 inline mr-1" />
                        Mark Expired
                      </button>
                    </div>
                  )}

                  {/* Assignment Form */}
                  {editingId === option.id && (
                    <div className="mt-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20 space-y-3">
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-200">Assignment Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Shares Assigned"
                          type="number"
                          placeholder={`${option.quantity * 100}`}
                          id={`shares-${option.id}`}
                        />
                        <Input
                          label="Stock Price at Assignment"
                          type="number"
                          step="0.01"
                          placeholder={`${option.strike}`}
                          id={`price-${option.id}`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            const shares = parseInt((document.getElementById(`shares-${option.id}`) as HTMLInputElement).value) || option.quantity * 100;
                            const price = parseFloat((document.getElementById(`price-${option.id}`) as HTMLInputElement).value) || option.strike;
                            handleUpdateStatus(option.id, 'assigned', shares, price);
                          }}
                        >
                          Confirm Assignment
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
