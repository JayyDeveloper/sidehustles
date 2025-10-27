import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HustleList } from '../components/HustleList';
import { Analytics } from '../components/Analytics';
import { OptionsTracker } from '../components/OptionsTracker';
import { Modal } from '../components/Modal';
import { HustleForm } from '../components/HustleForm';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import type { CreateHustleInput, Hustle } from '../types/schema';

export function Dashboard() {
  const { hustles, createHustle, reorderHustles, toast } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter hustles by status
  const activeHustles = useMemo(() => {
    return hustles
      .filter((h) => h.status === 'active')
      .filter((h) =>
        searchQuery ? h.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
      .sort((a, b) => a.order - b.order);
  }, [hustles, searchQuery]);

  const futureHustles = useMemo(() => {
    return hustles
      .filter((h) => h.status === 'future')
      .filter((h) =>
        searchQuery ? h.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
      .sort((a, b) => a.order - b.order);
  }, [hustles, searchQuery]);

  const handleCreateHustle = async (data: CreateHustleInput) => {
    try {
      await createHustle(data);
      setIsCreateModalOpen(false);
      toast.success(`Hustle "${data.name}" created successfully`);
    } catch (error) {
      toast.error('Failed to create hustle');
      console.error(error);
    }
  };

  const handleReorderActive = async (reordered: Hustle[]) => {
    // Combine reordered active hustles with other hustles
    const otherHustles = hustles.filter((h) => h.status !== 'active');
    await reorderHustles([...reordered, ...otherHustles]);
  };

  const handleReorderFuture = async (reordered: Hustle[]) => {
    // Combine reordered future hustles with other hustles
    const otherHustles = hustles.filter((h) => h.status !== 'future');
    await reorderHustles([...reordered, ...otherHustles]);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage your side hustles and track your progress</p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search hustles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            New Hustle
          </Button>
        </div>
      </div>

      {/* Options Trading Tracker */}
      <div className="mb-8">
        <OptionsTracker />
      </div>

      {/* Analytics overview */}
      <div className="mb-8">
        <Analytics hustles={hustles} />
      </div>

      {/* Hustle lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <HustleList
          title="Active Hustles"
          hustles={activeHustles}
          emptyMessage="No active hustles. Move a future hustle to active or create a new one!"
          onReorder={handleReorderActive}
          onAdd={() => setIsCreateModalOpen(true)}
        />

        <HustleList
          title="Future Hustles"
          hustles={futureHustles}
          emptyMessage="No future hustles. Create one to start planning!"
          onReorder={handleReorderFuture}
          onAdd={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Create hustle modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Hustle"
      >
        <HustleForm
          onSubmit={handleCreateHustle}
          onCancel={() => setIsCreateModalOpen(false)}
          submitLabel="Create Hustle"
        />
      </Modal>
    </div>
  );
}
