
import React, { useState, useRef } from 'react';
import { format, isToday } from 'date-fns';
import { Task } from '@/types';
import TaskCard from './TaskCard';
import { useTaskContext } from '@/context/TaskContext';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface DayColumnProps {
  date: Date;
  tasks: Task[];
  onDrop: (taskId: string, date: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ date, tasks, onDrop }) => {
  const { addTask, reorderTasks } = useTaskContext();
  const [isOver, setIsOver] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayName = format(date, 'EEE');
  const dayNumber = format(date, 'dd.MM');
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onDrop(taskId, dateStr);
    setIsOver(false);
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    const element = e.currentTarget as HTMLElement;
    element.classList.add('task-drag');
    
    // Set ghost drag image
    // This is a workaround for the browser's default drag image
    setTimeout(() => {
      element.classList.remove('task-drag');
    }, 0);
  };

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask(dateStr, newTaskContent.trim());
      setNewTaskContent('');
      setShowInput(false);
    }
  };

  const handleColumnClick = (e: React.MouseEvent) => {
    // Only show input if clicking directly on the column, not on a task
    if ((e.target as HTMLElement).className.includes('day-column')) {
      setShowInput(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setNewTaskContent('');
    }
  };

  // Sort tasks by order
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div
      className={cn(
        'day-column',
        isOver && 'active',
        isToday(date) && 'bg-primary/5'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleColumnClick}
    >
      <div className="mb-3">
        <div className="text-xs text-muted-foreground">{dayName}</div>
        <div className={cn(
          "font-medium", 
          isToday(date) && "text-primary font-bold"
        )}>
          {dayNumber}
        </div>
      </div>
      
      {sortedTasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onDragStart={handleDragStart}
        />
      ))}
      
      {showInput && (
        <div className="mb-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-background border border-border rounded-md px-2 py-1 text-sm"
              placeholder="New task"
              autoFocus
            />
            <button 
              onClick={handleAddTask}
              className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-sm"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayColumn;
