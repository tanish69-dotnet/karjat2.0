'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  estimatedMinutes?: number;
  energyRequired: number; // 1 to 5
  isFlexible: boolean;
  completed: boolean;
  createdAt: string;
  subtasks?: Subtask[];
}

export interface ActivityItem {
  id: string;
  type: 'task_completed' | 'focus_session' | 'rest_session' | 'energy_checkin';
  title: string;
  timestamp: string;
  details?: string;
}

interface ThawContextType {
  energyLevel: number;
  setEnergyLevel: (level: number) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  deleteSubtask: (taskId: string, subId: string) => void;
  reorderSubtasks: (taskId: string, subtasks: Subtask[]) => void;
  activities: ActivityItem[];
  logActivity: (type: ActivityItem['type'], title: string, details?: string) => void;
  clearAllData: () => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

const ThawContext = createContext<ThawContextType | undefined>(undefined);

const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Prepare Digital Electronics assignment outline',
    description: 'Draft the introduction and gather references for the logic gate schematic.',
    deadline: 'Tomorrow',
    estimatedMinutes: 25,
    energyRequired: 3,
    isFlexible: false,
    completed: false,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Open the assignment document', completed: false },
      { id: 'sub-2', title: 'Gather logic gate references', completed: false },
    ],
  },
  {
    id: 't-2',
    title: 'Review Chapter 4 notes for Algorithms',
    description: 'Read dynamic programming summary and write 3 summary bullets.',
    deadline: 'In 2 days',
    estimatedMinutes: 15,
    energyRequired: 2,
    isFlexible: true,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 't-3',
    title: 'Tidy desk & refill water bottle',
    description: 'Clear sensory clutter to create a calm physical study space.',
    deadline: 'Today',
    estimatedMinutes: 5,
    energyRequired: 1,
    isFlexible: true,
    completed: true,
    createdAt: new Date().toISOString()
  }
];

export function ThawProvider({ children }: { children: React.ReactNode }) {
  const [energyLevel, setEnergyLevelState] = useState<number>(3);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'a-1',
      type: 'task_completed',
      title: 'Tidy desk & refill water bottle',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'Completed 5 min focus session'
    }
  ]);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedEnergy = localStorage.getItem('thaw_energy');
      const savedTasks = localStorage.getItem('thaw_tasks');
      const savedActivities = localStorage.getItem('thaw_activities');
      const savedMotion = localStorage.getItem('thaw_motion');

      if (savedEnergy) setEnergyLevelState(JSON.parse(savedEnergy));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedActivities) setActivities(JSON.parse(savedActivities));
      if (savedMotion) setReducedMotion(JSON.parse(savedMotion));
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
  }, []);

  const setEnergyLevel = (level: number) => {
    setEnergyLevelState(level);
    localStorage.setItem('thaw_energy', JSON.stringify(level));
    logActivity('energy_checkin', `Updated energy level to ${level}/5 spoons`, 'Energy adjustment');
  };

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('thaw_tasks', JSON.stringify(newTasks));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
      subtasks: [],
    };
    const updated = [newTask, ...tasks];
    saveTasks(updated);
    logActivity('task_completed', `Created task: ${newTask.title}`);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  const toggleTaskComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const nextCompleted = !task.completed;
    updateTask(id, { completed: nextCompleted });
    if (nextCompleted) {
      logActivity('task_completed', `Completed task: ${task.title}`);
    }
  };

  const addSubtask = (taskId: string, title: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !title.trim()) return;
    const subtask: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      completed: false,
    };
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: [...(t.subtasks ?? []), subtask],
      };
    });
    saveTasks(updated);
  };

  const toggleSubtask = (taskId: string, subId: string) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: (t.subtasks ?? []).map((s) =>
          s.id === subId ? { ...s, completed: !s.completed } : s
        ),
      };
    });
    saveTasks(updated);
  };

  const deleteSubtask = (taskId: string, subId: string) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: (t.subtasks ?? []).filter((s) => s.id !== subId),
      };
    });
    saveTasks(updated);
  };

  const reorderSubtasks = (taskId: string, subtasks: Subtask[]) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks };
    });
    saveTasks(updated);
  };

  const logActivity = (type: ActivityItem['type'], title: string, details?: string) => {
    const newItem: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title,
      timestamp: new Date().toISOString(),
      details
    };
    const updated = [newItem, ...activities];
    setActivities(updated);
    try {
      localStorage.setItem('thaw_activities', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    setEnergyLevelState(3);
    setTasks(INITIAL_TASKS);
    setActivities([]);
  };

  return (
    <ThawContext.Provider value={{
      energyLevel,
      setEnergyLevel,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      reorderSubtasks,
      activities,
      logActivity,
      clearAllData,
      reducedMotion,
      setReducedMotion,
      isDemoMode,
      setIsDemoMode
    }}>
      {children}
    </ThawContext.Provider>
  );
}

export function useThaw() {
  const context = useContext(ThawContext);
  if (!context) {
    throw new Error('useThaw must be used within a ThawProvider');
  }
  return context;
}
