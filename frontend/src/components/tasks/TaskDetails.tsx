import React from 'react';
import { format, parseISO } from 'date-fns';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { Task } from '../../types';

interface TaskDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ isOpen, onClose, task, onEdit }) => {
  if (!task) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy - h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" maxWidth="md">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{task.title}</h3>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
          <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-md border border-slate-100 min-h-[60px]">
            {task.description || <span className="italic text-slate-400">No description provided.</span>}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Priority</h4>
            <Badge variant={task.priority} className="text-sm px-3 py-1">{task.priority}</Badge>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</h4>
            <Badge variant={task.status} className="text-sm px-3 py-1">{task.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Time</h4>
            <p className="text-sm text-slate-700">{formatDate(task.startTime)}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Due Date</h4>
            <p className="text-sm text-slate-700">{formatDate(task.endTime)}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Created At</h4>
          <p className="text-sm text-slate-500">{formatDate(task.createdAt)}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            Edit Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
