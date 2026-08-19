import React, { useState } from 'react';
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
  onAddFollowUp?: (task: Task, content: string, reminderTime?: string) => Promise<boolean>;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ isOpen, onClose, task, onEdit, onAddFollowUp }) => {
  const [newFollowUp, setNewFollowUp] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy - h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const handleAddFollowUp = async () => {
    if (!newFollowUp.trim() || !onAddFollowUp) return;
    setIsSubmitting(true);
    const success = await onAddFollowUp(task, newFollowUp.trim(), reminderTime || undefined);
    if (success) {
      setNewFollowUp('');
      setReminderTime('');
    }
    setIsSubmitting(false);
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

        {/* Follow Ups Section */}
        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Follow-Ups</h4>
          
          <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto pr-2">
            {!task.followUps || task.followUps.length === 0 ? (
              <p className="text-sm italic text-slate-400">No follow-ups recorded yet.</p>
            ) : (
              task.followUps.map(fu => (
                <div key={fu.id} className="bg-slate-50 border border-slate-100 p-3 rounded-md">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{fu.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-[10px] text-slate-400">{formatDate(fu.createdAt)}</p>
                    {fu.reminderTime && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Reminder: {formatDate(fu.reminderTime)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {onAddFollowUp && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a follow-up note..."
                  value={newFollowUp}
                  onChange={(e) => setNewFollowUp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFollowUp();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFF]/20 focus:border-[#5B4DFF]"
                />
                <Button onClick={handleAddFollowUp} isLoading={isSubmitting} disabled={!newFollowUp.trim()}>
                  Add
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Set Reminder:</span>
                <input
                  type="datetime-local"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="px-2 py-1 border border-slate-200 rounded text-xs text-slate-600 focus:outline-none focus:border-[#5B4DFF]"
                />
              </div>
            </div>
          )}
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
