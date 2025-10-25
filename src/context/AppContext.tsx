import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useHustles } from '../hooks/useHustles';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../hooks/useToast';

// Create context type
interface AppContextType {
  // Hustles
  hustles: ReturnType<typeof useHustles>['hustles'];
  loading: ReturnType<typeof useHustles>['loading'];
  error: ReturnType<typeof useHustles>['error'];
  createHustle: ReturnType<typeof useHustles>['createHustle'];
  updateHustle: ReturnType<typeof useHustles>['updateHustle'];
  deleteHustle: ReturnType<typeof useHustles>['deleteHustle'];
  changeStatus: ReturnType<typeof useHustles>['changeStatus'];
  addNote: ReturnType<typeof useHustles>['addNote'];
  updateNote: ReturnType<typeof useHustles>['updateNote'];
  deleteNote: ReturnType<typeof useHustles>['deleteNote'];
  addResource: ReturnType<typeof useHustles>['addResource'];
  deleteResource: ReturnType<typeof useHustles>['deleteResource'];
  addTransaction: ReturnType<typeof useHustles>['addTransaction'];
  deleteTransaction: ReturnType<typeof useHustles>['deleteTransaction'];
  duplicateHustle: ReturnType<typeof useHustles>['duplicateHustle'];
  reorderHustles: ReturnType<typeof useHustles>['reorderHustles'];
  reloadHustles: ReturnType<typeof useHustles>['reload'];
  addTask: ReturnType<typeof useHustles>['addTask'];
  toggleTask: ReturnType<typeof useHustles>['toggleTask'];
  deleteTask: ReturnType<typeof useHustles>['deleteTask'];
  addGoal: ReturnType<typeof useHustles>['addGoal'];
  updateGoalProgress: ReturnType<typeof useHustles>['updateGoalProgress'];
  deleteGoal: ReturnType<typeof useHustles>['deleteGoal'];
  updateStreak: ReturnType<typeof useHustles>['updateStreak'];

  // Settings
  settings: ReturnType<typeof useSettings>['settings'];
  updateSettings: ReturnType<typeof useSettings>['updateSettings'];
  toggleTheme: ReturnType<typeof useSettings>['toggleTheme'];

  // Toast
  toasts: ReturnType<typeof useToast>['toasts'];
  addToast: ReturnType<typeof useToast>['addToast'];
  removeToast: ReturnType<typeof useToast>['removeToast'];
  toast: {
    success: ReturnType<typeof useToast>['success'];
    error: ReturnType<typeof useToast>['error'];
    info: ReturnType<typeof useToast>['info'];
    warning: ReturnType<typeof useToast>['warning'];
    withUndo: ReturnType<typeof useToast>['withUndo'];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const hustlesHook = useHustles();
  const settingsHook = useSettings();
  const toastHook = useToast();

  const value: AppContextType = {
    // Hustles
    hustles: hustlesHook.hustles,
    loading: hustlesHook.loading,
    error: hustlesHook.error,
    createHustle: hustlesHook.createHustle,
    updateHustle: hustlesHook.updateHustle,
    deleteHustle: hustlesHook.deleteHustle,
    changeStatus: hustlesHook.changeStatus,
    addNote: hustlesHook.addNote,
    updateNote: hustlesHook.updateNote,
    deleteNote: hustlesHook.deleteNote,
    addResource: hustlesHook.addResource,
    deleteResource: hustlesHook.deleteResource,
    addTransaction: hustlesHook.addTransaction,
    deleteTransaction: hustlesHook.deleteTransaction,
    duplicateHustle: hustlesHook.duplicateHustle,
    reorderHustles: hustlesHook.reorderHustles,
    reloadHustles: hustlesHook.reload,
    addTask: hustlesHook.addTask,
    toggleTask: hustlesHook.toggleTask,
    deleteTask: hustlesHook.deleteTask,
    addGoal: hustlesHook.addGoal,
    updateGoalProgress: hustlesHook.updateGoalProgress,
    deleteGoal: hustlesHook.deleteGoal,
    updateStreak: hustlesHook.updateStreak,

    // Settings
    settings: settingsHook.settings,
    updateSettings: settingsHook.updateSettings,
    toggleTheme: settingsHook.toggleTheme,

    // Toast
    toasts: toastHook.toasts,
    addToast: toastHook.addToast,
    removeToast: toastHook.removeToast,
    toast: {
      success: toastHook.success,
      error: toastHook.error,
      info: toastHook.info,
      warning: toastHook.warning,
      withUndo: toastHook.withUndo,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
