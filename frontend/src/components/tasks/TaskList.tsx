import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface TaskListProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onAddFirst?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onView,
  onEdit,
  onDelete,
  onToggleComplete,
  onAddFirst,
}) => {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-6">
          <CheckCircle size={40} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No tasks found</h3>
        <p className="text-slate-500 max-w-md mb-8">
          You're all caught up! Create your first task and start organizing your day.
        </p>
        {onAddFirst && (
          <Button onClick={onAddFirst} size="lg">
            + Create Task
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 mb-2">
        <div className="w-5 shrink-0"></div> {/* Checkbox spacer */}
        <div className="flex-1 min-w-0 pr-4">Task</div>
        <div className="hidden md:block w-28 shrink-0">Dates</div>
        <div className="w-24 shrink-0">Priority</div>
        <div className="w-24 shrink-0">Status</div>
        <div className="w-24 shrink-0 text-right pr-2">Actions</div>
      </div>

      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
