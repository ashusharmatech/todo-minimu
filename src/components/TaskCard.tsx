import React, { useState, useRef, useEffect } from 'react';
import { Task, TaskColor, Subtask } from '@/types';
import { Check, X, ChevronDown, ChevronRight, Circle, CheckCircle, Trash, MoreHorizontal, Plus, ListIcon } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskCardProps {
  task: Task;
  onDragStart: (event: React.DragEvent, taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  const { updateTask, deleteTask, toggleTaskCompletion, addSubtask, toggleSubtaskCompletion, deleteSubtask, lists } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskContent, setNewSubtaskContent] = useState('');
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [selectedList, setSelectedList] = useState(task.list || 'none');
  const contentInputRef = useRef<HTMLInputElement>(null);

  const colorOptions: TaskColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'teal', 'cyan', 'indigo'];

  useEffect(() => {
    if (isEditing && contentInputRef.current) {
      contentInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateTask({
      ...task,
      content: editedContent.trim(),
      description: editedDescription.trim() || undefined,
      list: selectedList === 'none' ? undefined : selectedList,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(task.content);
    setEditedDescription(task.description || '');
    setSelectedList(task.list || 'none');
    setIsEditing(false);
  };

  const handleColorChange = (color: TaskColor) => {
    updateTask({
      ...task,
      color,
    });
  };

  const handleListChange = (listId: string) => {
    setSelectedList(listId);
  };

  const handleAddSubtask = () => {
    if (newSubtaskContent.trim()) {
      addSubtask(task.id, newSubtaskContent.trim());
      setNewSubtaskContent('');
      setShowSubtaskInput(false);
      setShowSubtasks(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Find the selected list for display
  const selectedListName = lists.find(list => list.id === task.list)?.name;

  return (
    <div
      className={cn(
        'task-card',
        task.color ? `task-card-${task.color}` : 'bg-secondary',
        task.completed && 'task-card-completed'
      )}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => !isEditing && handleEdit()}
    >
      {isEditing ? (
        <div onClick={(e) => e.stopPropagation()} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              ref={contentInputRef}
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-b border-border px-1 py-0.5 focus:outline-none"
              placeholder="Task title"
            />
          </div>
          
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full bg-transparent border border-border px-2 py-1 rounded-sm focus:outline-none resize-none text-sm min-h-[60px]"
            placeholder="Add description (optional)"
          />
          
          <div className="flex flex-wrap gap-1 mt-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                className={cn(
                  'w-5 h-5 rounded-full',
                  `bg-task-${color}`,
                  task.color === color && 'ring-2 ring-offset-2 ring-task-' + color
                )}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
          
          {lists.length > 0 && (
            <div className="mt-2">
              <Select value={selectedList} onValueChange={handleListChange}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No list</SelectItem>
                  {lists.map(list => (
                    <SelectItem key={list.id} value={list.id}>
                      <div className="flex items-center">
                        {list.color && (
                          <div 
                            className={`w-3 h-3 rounded-full mr-2 bg-task-${list.color}`}
                          />
                        )}
                        {list.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {showSubtaskInput ? (
            <div className="flex items-center gap-1 mt-2">
              <input
                type="text"
                value={newSubtaskContent}
                onChange={(e) => setNewSubtaskContent(e.target.value)}
                className="w-full bg-transparent border border-border px-2 py-1 rounded-sm focus:outline-none text-xs"
                placeholder="New subtask"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleAddSubtask}
                className="h-6 w-6 p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSubtaskInput(false);
                  setNewSubtaskContent('');
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSubtaskInput(true)}
              className="text-xs flex items-center gap-1 h-6 px-2"
            >
              <Plus className="h-3 w-3" />
              Add subtask
            </Button>
          )}
          
          <div className="flex justify-between mt-2">
            <Button 
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => deleteTask(task.id)}
              className="h-7 text-xs"
            >
              <Trash className="h-3 w-3 mr-1" /> Delete
            </Button>
            
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSave}
                className="h-7 text-xs"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskCompletion(task.id);
            }}
            className="mt-0.5"
          >
            {task.completed ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex-1">
            <div className={cn(task.completed && 'line-through')}>
              {task.content}
            </div>
            
            {task.description && (
              <div className="text-sm text-muted-foreground mt-1">
                {task.description}
              </div>
            )}
            
            {selectedListName && (
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <ListIcon className="h-3 w-3 mr-1" /> {selectedListName}
              </div>
            )}
            
            {task.subtasks.length > 0 && (
              <div className="mt-2">
                <button
                  type="button"
                  className="text-xs flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSubtasks(!showSubtasks);
                  }}
                >
                  {showSubtasks ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                </button>
                
                {showSubtasks && (
                  <ul className="subtask-list">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask.id} className="subtask-item">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubtaskCompletion(task.id, subtask.id);
                          }}
                          className="mr-1"
                        >
                          {subtask.completed ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Circle className="h-3 w-3" />
                          )}
                        </button>
                        <span className={cn(subtask.completed && 'line-through opacity-60')}>
                          {subtask.content}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
