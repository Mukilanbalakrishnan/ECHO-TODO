import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { Priority, Status, Task } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('Pending');
  const [errors, setErrors] = useState<{ title?: string; dates?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        // format dates for input type="datetime-local" (YYYY-MM-DDTHH:mm)
        setStartTime(task.startTime ? task.startTime.slice(0, 16) : '');
        setEndTime(task.endTime ? task.endTime.slice(0, 16) : '');
        setPriority(task.priority);
        setStatus(task.status);
      } else {
        setTitle('');
        setDescription('');
        setStartTime('');
        setEndTime('');
        setPriority('Medium');
        setStatus('Pending');
      }
      setErrors({});
    }
  }, [isOpen, task]);

  const handleSave = () => {
    const newErrors: { title?: string; dates?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (startTime && endTime) {
      if (new Date(startTime) > new Date(endTime)) {
        newErrors.dates = 'Start time cannot be after end time';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const savedTask: Task = {
      id: task ? task.id : uuidv4(),
      title: title.trim(),
      description: description.trim(),
      startTime: startTime ? new Date(startTime).toISOString() : undefined,
      endTime: endTime ? new Date(endTime).toISOString() : undefined,
      priority,
      status,
      createdAt: task ? task.createdAt : new Date().toISOString(),
    };

    onSave(savedTask);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <Input
          label="Task Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-200 resize-none"
            rows={3}
            placeholder="Describe your task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            label="End Time / Due Date"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            error={errors.dates}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={[
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
              { label: 'Urgent', value: 'Urgent' },
            ]}
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            options={[
              { label: 'Pending', value: 'Pending' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Completed', value: 'Completed' },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
