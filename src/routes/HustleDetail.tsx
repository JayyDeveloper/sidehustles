import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Copy,
  Download,
  Archive,
  PlayCircle,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UpdateHustleInput } from '../types/schema';
import { NotesPanel } from '../components/NotesPanel';
import { ResourcesPanel } from '../components/ResourcesPanel';
import { FinancePanel } from '../components/FinancePanel';
import { ActivityLog } from '../components/ActivityLog';
import { TasksPanel } from '../components/TasksPanel';
import { GoalsPanel } from '../components/GoalsPanel';
import { ChartsPanel } from '../components/ChartsPanel';
import { StreakCounter } from '../components/StreakCounter';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { Card, CardBody } from '../components/Card';
import { Modal } from '../components/Modal';

export function HustleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    hustles,
    updateHustle,
    deleteHustle,
    changeStatus,
    addNote,
    updateNote,
    deleteNote,
    addResource,
    deleteResource,
    addTransaction,
    deleteTransaction,
    duplicateHustle,
    addTask,
    toggleTask,
    deleteTask,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    updateStreak,
    toast,
  } = useApp();

  const hustle = hustles.find((h) => h.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!hustle) {
      navigate('/');
    }
  }, [hustle, navigate]);

  if (!hustle) {
    return null;
  }

  const handleUpdateBasic = async () => {
    const updates: UpdateHustleInput = {};

    if (editName.trim() && editName !== hustle.name) {
      updates.name = editName;
    }

    if (editDescription !== hustle.description) {
      updates.description = editDescription;
    }

    if (Object.keys(updates).length > 0) {
      await updateHustle(hustle.id, updates);
      toast.success('Hustle updated');
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    const hustleName = hustle.name;
    await deleteHustle(hustle.id);
    toast.success(`"${hustleName}" deleted`);
    navigate('/');
  };

  const handleDuplicate = async () => {
    const duplicated = await duplicateHustle(hustle.id);
    if (duplicated) {
      toast.success(`"${hustle.name}" duplicated`);
      navigate(`/hustle/${duplicated.id}`);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(hustle, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${hustle.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Hustle exported');
  };

  const handleToggleStatus = async () => {
    const newStatus = hustle.status === 'active' ? 'future' : 'active';
    await changeStatus(hustle.id, newStatus);
    toast.success(`Moved to ${newStatus}`);
  };

  const handleArchive = async () => {
    await changeStatus(hustle.id, 'archived');
    toast.success('Hustle archived');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <Card>
          <CardBody>
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Hustle name"
                  autoFocus
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateBasic}>Save Changes</Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">
                      {hustle.name}
                    </h1>
                    <p className="text-gray-400">{hustle.description || 'No description'}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditName(hustle.name);
                      setEditDescription(hustle.description);
                      setIsEditing(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </div>

                {/* Status and actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                      hustle.status === 'active'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {hustle.status === 'active' ? 'Active' : 'Future'}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                      hustle.priority === 'high'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : hustle.priority === 'medium'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}
                  >
                    {hustle.priority} priority
                  </span>

                  <div className="ml-auto flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleToggleStatus}>
                      {hustle.status === 'active' ? (
                        <>
                          <Clock className="w-4 h-4" />
                          Move to Future
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          Move to Active
                        </>
                      )}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={handleDuplicate}>
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>

                    <Button variant="ghost" size="sm" onClick={handleExport}>
                      <Download className="w-4 h-4" />
                      Export
                    </Button>

                    <Button variant="ghost" size="sm" onClick={handleArchive}>
                      <Archive className="w-4 h-4" />
                      Archive
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Streak Counter */}
      <div className="mb-6">
        <StreakCounter
          streakData={hustle.streakData}
          onLogWork={async () => {
            await updateStreak(hustle.id);
            toast.success('Work logged! Streak updated.');
          }}
        />
      </div>

      {/* Charts */}
      <div className="mb-6">
        <ChartsPanel transactions={hustle.transactions} />
      </div>

      {/* Content panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <TasksPanel
            tasks={hustle.tasks}
            onAddTask={async (data) => { await addTask(hustle.id, data); }}
            onToggleTask={(taskId) => toggleTask(hustle.id, taskId)}
            onDeleteTask={(taskId) => deleteTask(hustle.id, taskId)}
          />

          <GoalsPanel
            goals={hustle.goals}
            onAddGoal={async (data) => {
              await addGoal(hustle.id, data);
              await updateGoalProgress(hustle.id);
            }}
            onDeleteGoal={(goalId) => deleteGoal(hustle.id, goalId)}
          />

          <FinancePanel
            transactions={hustle.transactions}
            onAddTransaction={async (data) => {
              await addTransaction(hustle.id, data);
              await updateGoalProgress(hustle.id);
            }}
            onDeleteTransaction={async (txId) => {
              await deleteTransaction(hustle.id, txId);
              await updateGoalProgress(hustle.id);
            }}
          />

          <NotesPanel
            notes={hustle.notes}
            onAddNote={async (content) => { await addNote(hustle.id, { content }); }}
            onUpdateNote={(noteId, content) => updateNote(hustle.id, noteId, content)}
            onDeleteNote={(noteId) => deleteNote(hustle.id, noteId)}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <ResourcesPanel
            resources={hustle.resources}
            onAddResource={async (data) => { await addResource(hustle.id, data); }}
            onDeleteResource={(resId) => deleteResource(hustle.id, resId)}
          />

          <ActivityLog activities={hustle.activityLog} />
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Hustle"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete "{hustle.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
