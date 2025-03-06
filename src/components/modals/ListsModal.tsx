import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTaskContext } from '@/context/TaskContext';
import { Plus, X, Pencil, Check } from 'lucide-react';
import { List, TaskColor } from '@/types';
import { cn } from '@/lib/utils';

interface ListsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ListsModal: React.FC<ListsModalProps> = ({ isOpen, onClose }) => {
  const { lists, createList, updateList, deleteList } = useTaskContext();
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState<TaskColor>('blue');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState<TaskColor>('blue');

  const colorOptions: TaskColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'teal', 'cyan', 'indigo'];

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim(), newListColor);
      setNewListName('');
      setNewListColor('blue');
    }
  };

  const handleStartEdit = (list: List) => {
    setEditingListId(list.id);
    setEditName(list.name);
    setEditColor(list.color as TaskColor || 'blue');
  };

  const handleSaveEdit = () => {
    if (editingListId && editName.trim()) {
      updateList({
        id: editingListId,
        name: editName.trim(),
        color: editColor,
      });
      setEditingListId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingListId(null);
  };

  const handleDeleteList = (listId: string) => {
    if (confirm('Are you sure you want to delete this list?')) {
      deleteList(listId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Lists</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
            />
            
            <div className="flex gap-1">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    'w-6 h-6 rounded-full',
                    `bg-task-${color}`,
                    newListColor === color && 'ring-2 ring-offset-2 ring-task-' + color
                  )}
                  onClick={() => setNewListColor(color)}
                />
              ))}
            </div>
            
            <Button onClick={handleCreateList}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {lists.map((list) => (
              <div key={list.id} className="flex items-center justify-between p-2 border rounded-md">
                {editingListId === list.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                    />
                    
                    <div className="flex gap-1">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={cn(
                            'w-6 h-6 rounded-full',
                            `bg-task-${color}`,
                            editColor === color && 'ring-2 ring-offset-2 ring-task-' + color
                          )}
                          onClick={() => setEditColor(color)}
                        />
                      ))}
                    </div>
                    
                    <Button variant="ghost" size="icon" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full',
                          list.color ? `bg-task-${list.color}` : 'bg-gray-400'
                        )}
                      />
                      <span>{list.name}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleStartEdit(list)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteList(list.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {lists.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No lists yet. Create one to get started.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListsModal;
