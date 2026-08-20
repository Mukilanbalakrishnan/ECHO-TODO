import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Eye, Edit2, Trash2, Calendar, Clock, Check } from 'lucide-react';
import type { Task } from '../../types';
import { Badge } from '../common/Badge';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onView,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const isCompleted = task.status === 'Completed';

  // State to force re-render for ticking time
  const [, setTick] = useState(0);

  useEffect(() => {
    // Only set up interval if the task is pending and has an end time
    if (isCompleted || !task.endTime) return;
    
    const intervalId = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000); // Tick every second

    return () => clearInterval(intervalId);
  }, [task.endTime, isCompleted]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), 'MMM d, yy');
    } catch {
      return 'Invalid date';
    }
  };

  const getDueTimeText = () => {
    if (!task.endTime) return null;
    if (isCompleted) {
      return formatDate(task.endTime); // Show static date if already completed
    }
    
    try {
      const date = parseISO(task.endTime);
      const now = new Date();
      const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
      
      const isOverdue = diffInSeconds < 0;
      const absDiff = Math.abs(diffInSeconds);
      
      const hours = Math.floor(absDiff / 3600);
      const minutes = Math.floor((absDiff % 3600) / 60);
      const seconds = absDiff % 60;
      
      const pad = (num: number) => num.toString().padStart(2, '0');
      
      let timeString = '';
      if (hours > 0) {
        // Only show days if it's more than 24h
        if (hours > 24) {
          const days = Math.floor(hours / 24);
          const remainingHours = hours % 24;
          timeString = `${days}d ${pad(remainingHours)}:${pad(minutes)}:${pad(seconds)}`;
        } else {
          timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
      } else {
        timeString = `${pad(minutes)}:${pad(seconds)}`;
      }
      
      if (isOverdue) {
        return `-${timeString}`;
      }
      return timeString;
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        'group relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md flex flex-wrap sm:flex-nowrap items-center gap-y-3 gap-x-4',
        isCompleted ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200',
        task.priority === 'Urgent' && !isCompleted ? 'border-red-200 shadow-red-100/50' : ''
      )}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
            isCompleted
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-300 text-transparent hover:border-indigo-500 hover:text-indigo-200'
          )}
        >
          <Check size={12} strokeWidth={isCompleted ? 3 : 2} />
        </button>
      </div>

      {/* Main Content: Title & Desc */}
      <div className="flex-1 min-w-0 sm:pr-4">
        <h3
          className={cn(
            'text-sm font-semibold truncate transition-colors mb-0.5',
            isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
          )}
        >
          {task.title}
        </h3>
        <p
          className={cn(
            'text-xs truncate',
            isCompleted ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          {task.description || <span className="italic text-slate-400">No description provided.</span>}
        </p>
      </div>

      {/* Mobile Actions (Always visible, inline with title) */}
      <div className="flex sm:hidden items-center gap-2 shrink-0 ml-auto">
        <button
          onClick={() => onView(task)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-md transition-colors"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Mobile Line Break */}
      <div className="w-full sm:hidden" />

      {/* Dates */}
      <div className="flex sm:hidden md:flex flex-col gap-1 w-auto sm:w-28 shrink-0 text-[11px] text-slate-500 pl-9 sm:pl-0 mr-4 sm:mr-0">
        {task.startTime && (
          <div className="flex items-center gap-1.5 truncate" title={`Start: ${format(parseISO(task.startTime), 'MMM d, yyyy h:mm a')}`}>
            <Clock size={12} className="text-slate-400 shrink-0" />
            <span className="truncate">{formatDate(task.startTime)}</span>
          </div>
        )}
        {task.endTime && (
          <div className="flex items-center gap-1.5 truncate" title={`Due: ${format(parseISO(task.endTime), 'MMM d, yyyy h:mm a')}`}>
            <Calendar size={12} className={task.priority === 'Urgent' && !isCompleted ? 'text-red-400 shrink-0' : 'text-slate-400 shrink-0'} />
            <span className={cn('truncate', task.priority === 'Urgent' && !isCompleted ? 'text-red-600 font-medium' : '')}>
              {getDueTimeText()}
            </span>
          </div>
        )}
      </div>

      {/* Priority */}
      <div className="flex w-auto sm:w-24 shrink-0 items-center justify-start mr-4 sm:mr-0">
        <Badge variant={task.priority} className="text-[11px]">
          {task.priority}
        </Badge>
      </div>

      {/* Status */}
      <div className="flex w-auto sm:w-24 shrink-0 items-center justify-start">
        <Badge variant={task.status} className="text-[11px]">
          {task.status}
        </Badge>
      </div>

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity w-24 shrink-0 justify-end">
        <button
          onClick={() => onView(task)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
          title="View Details"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Edit Task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
