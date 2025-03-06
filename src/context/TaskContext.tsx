
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskList, Subtask, List } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

interface TaskContextType {
  tasks: TaskList;
  lists: List[];
  loading: boolean;
  addTask: (date: string, content: string) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  moveTask: (taskId: string, newDate: string) => void;
  addSubtask: (taskId: string, content: string) => void;
  updateSubtask: (taskId: string, subtask: Subtask) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
  createList: (name: string, color?: string) => void;
  updateList: (list: List) => void;
  deleteList: (listId: string) => void;
  exportData: (format: 'json' | 'csv') => void;
  reorderTasks: (date: string, taskIds: string[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskList>({});
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = localStorage.getItem('tasks');
        const storedLists = localStorage.getItem('lists');
        
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
        
        if (storedLists) {
          setLists(JSON.parse(storedLists));
        } else {
          // Create default lists if none exist
          const defaultLists = [
            { id: uuidv4(), name: 'Personal', color: 'blue' },
            { id: uuidv4(), name: 'Work', color: 'green' },
          ];
          setLists(defaultLists);
          localStorage.setItem('lists', JSON.stringify(defaultLists));
        }
      } catch (error) {
        console.error('Failed to load tasks from localStorage', error);
        toast({
          title: "Error",
          description: "Failed to load your tasks",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('lists', JSON.stringify(lists));
    }
  }, [lists, loading]);

  const addTask = (date: string, content: string) => {
    const newTask: Task = {
      id: uuidv4(),
      content,
      completed: false,
      date,
      subtasks: [],
      order: tasks[date] ? tasks[date].length : 0,
    };

    setTasks(prev => {
      const updatedTasks = { ...prev };
      if (!updatedTasks[date]) {
        updatedTasks[date] = [];
      }
      updatedTasks[date] = [...updatedTasks[date], newTask];
      return updatedTasks;
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      // Find and remove the task from its current date
      Object.keys(updatedTasks).forEach(date => {
        updatedTasks[date] = updatedTasks[date].filter(task => task.id !== updatedTask.id);
        
        // Remove empty date arrays
        if (updatedTasks[date].length === 0) {
          delete updatedTasks[date];
        }
      });
      
      // Add the task to its (potentially new) date
      if (!updatedTasks[updatedTask.date]) {
        updatedTasks[updatedTask.date] = [];
      }
      
      updatedTasks[updatedTask.date] = [...updatedTasks[updatedTask.date], updatedTask];
      
      return updatedTasks;
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      Object.keys(updatedTasks).forEach(date => {
        updatedTasks[date] = updatedTasks[date].filter(task => task.id !== taskId);
        
        // Remove empty date arrays
        if (updatedTasks[date].length === 0) {
          delete updatedTasks[date];
        }
      });
      
      return updatedTasks;
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      Object.keys(updatedTasks).forEach(date => {
        updatedTasks[date] = updatedTasks[date].map(task => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
      });
      
      return updatedTasks;
    });
  };

  const moveTask = (taskId: string, newDate: string) => {
    let taskToMove: Task | undefined;
    
    // Find the task
    Object.keys(tasks).forEach(date => {
      const foundTask = tasks[date].find(task => task.id === taskId);
      if (foundTask) {
        taskToMove = { ...foundTask, date: newDate };
      }
    });
    
    if (taskToMove) {
      updateTask(taskToMove);
    }
  };

  const addSubtask = (taskId: string, content: string) => {
    const newSubtask: Subtask = {
      id: uuidv4(),
      content,
      completed: false,
    };
    
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      Object.keys(updatedTasks).forEach(date => {
        updatedTasks[date] = updatedTasks[date].map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              subtasks: [...task.subtasks, newSubtask],
            };
          }
          return task;
        });
      });
      
      return updatedTasks;
    });
  };

  const updateSubtask = (taskId: string, updatedSubtask: Subtask) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      Object.keys(updatedTasks).forEach(date => {
        updatedTasks[date] = updatedTasks[date].map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              subtasks: task.subtasks.map(subtask => 
                subtask.id === updatedSubtask.id ? updatedSubtask : subtask
              ),
            };
          }
          return task;
        });
      });
      
      return updatedTasks;
    });
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      Object.keys(updatedTasks).forEach(date => {
        updatedTasks[date] = updatedTasks[date].map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId),
            };
          }
          return task;
        });
      });
      
      return updatedTasks;
    });
  };

  const toggleSubtaskCompletion = (taskId: string, subtaskId: string) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      Object.keys(updatedTasks).forEach(date => {
        updatedTasks[date] = updatedTasks[date].map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              subtasks: task.subtasks.map(subtask => {
                if (subtask.id === subtaskId) {
                  return { ...subtask, completed: !subtask.completed };
                }
                return subtask;
              }),
            };
          }
          return task;
        });
      });
      
      return updatedTasks;
    });
  };

  const createList = (name: string, color?: string) => {
    const newList: List = {
      id: uuidv4(),
      name,
      color,
    };
    
    setLists(prev => [...prev, newList]);
  };

  const updateList = (updatedList: List) => {
    setLists(prev => 
      prev.map(list => list.id === updatedList.id ? updatedList : list)
    );
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  const exportData = (format: 'json' | 'csv') => {
    try {
      if (format === 'json') {
        const data = JSON.stringify({ tasks, lists }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `planner-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Export successful",
          description: "Your data has been exported as JSON",
        });
      } else if (format === 'csv') {
        // Flatten tasks for CSV export
        const flattenedTasks: any[] = [];
        
        Object.keys(tasks).forEach(date => {
          tasks[date].forEach(task => {
            flattenedTasks.push({
              id: task.id,
              content: task.content,
              description: task.description || '',
              completed: task.completed ? 'Yes' : 'No',
              date,
              color: task.color || '',
              list: task.list || '',
              subtasks: task.subtasks.length,
            });
          });
        });
        
        // Convert to CSV
        const headers = Object.keys(flattenedTasks[0] || {}).join(',');
        const rows = flattenedTasks.map(task => 
          Object.values(task).map(value => 
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
          ).join(',')
        );
        
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `planner-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Export successful",
          description: "Your data has been exported as CSV",
        });
      }
    } catch (error) {
      console.error('Failed to export data', error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting your data",
        variant: "destructive",
      });
    }
  };

  const reorderTasks = (date: string, taskIds: string[]) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      
      if (updatedTasks[date]) {
        const tasksMap = new Map(updatedTasks[date].map(task => [task.id, task]));
        
        // Create a new array with the tasks in the desired order
        updatedTasks[date] = taskIds
          .filter(id => tasksMap.has(id))
          .map((id, index) => {
            const task = tasksMap.get(id)!;
            return { ...task, order: index };
          });
      }
      
      return updatedTasks;
    });
  };

  const value: TaskContextType = {
    tasks,
    lists,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtaskCompletion,
    createList,
    updateList,
    deleteList,
    exportData,
    reorderTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
