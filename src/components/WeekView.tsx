
import React from 'react';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addWeeks, 
  subWeeks,
  format,
  isToday,
  getMonth,
  getYear
} from 'date-fns';
import DayColumn from './DayColumn';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, onDateChange }) => {
  const { tasks, moveTask } = useTaskContext();
  
  // Calculate the start and end of the week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate an array of days for the week
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };
  
  // Go to current week
  const goToToday = () => {
    onDateChange(new Date());
  };
  
  // Handle dropping a task on a day
  const handleDrop = (taskId: string, date: string) => {
    moveTask(taskId, date);
  };
  
  // Get the month and year for the header
  const month = format(currentDate, 'MMMM yyyy');
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl font-bold">{month}</h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs"
          >
            Today
          </Button>
          
          <div className="flex">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousWeek}
              className="rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextWeek}
              className="rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-7 gap-2 overflow-auto">
        {daysOfWeek.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const tasksForDay = tasks[dateStr] || [];
          
          return (
            <DayColumn
              key={dateStr}
              date={day}
              tasks={tasksForDay}
              onDrop={handleDrop}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
