
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, ListFilter } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DateView = () => {
  const { tasks, lists } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Format the selected date for display and data lookup
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const tasksForDate = tasks[formattedDate] || [];

  // Filter tasks based on list and search term
  const filteredTasks = tasksForDate.filter(task => {
    const matchesList = !filter || task.list === filter;
    const matchesSearch = !searchTerm || 
      task.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesList && matchesSearch;
  });

  // Dummy function for drag start (for TaskCard component)
  const handleDragStart = () => {}; // Not needed in this view

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Tasks for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
          </h1>
          <p className="text-muted-foreground">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} 
            {filter && ` in ${lists.find(l => l.id === filter)?.name || 'selected list'}`}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                <span>{filter ? lists.find(l => l.id === filter)?.name : 'All Lists'}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Lists</SelectItem>
              {lists.map(list => (
                <SelectItem key={list.id} value={list.id}>
                  <div className="flex items-center gap-2">
                    {list.color && (
                      <div className={`w-3 h-3 rounded-full bg-task-${list.color}`}></div>
                    )}
                    {list.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto"
          />
        </div>
      </div>

      <div>
        {filteredTasks.length > 0 ? (
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} onDragStart={handleDragStart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-secondary/20">
            <p className="text-muted-foreground">No tasks found for this date.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setFilter('');
                setSearchTerm('');
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateView;
