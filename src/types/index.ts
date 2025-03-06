
export interface Subtask {
  id: string;
  content: string;
  completed: boolean;
}

export interface Task {
  id: string;
  content: string;
  description?: string;
  completed: boolean;
  date: string; // ISO date string YYYY-MM-DD
  color?: string;
  list?: string;
  subtasks: Subtask[];
  order: number;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
  };
}

export interface List {
  id: string;
  name: string;
  color?: string;
}

export interface TaskList {
  [date: string]: Task[];
}

export type TaskColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'teal' | 'cyan' | 'indigo';

export interface User {
  id: string;
  email: string;
  name?: string;
}
