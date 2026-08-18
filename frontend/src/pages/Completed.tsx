import React, { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../contexts/ToastContext';
import type { FilterState } from '../components/tasks/TaskFilters';
import type { Task } from '../types';
import { TaskFilters as FiltersComponent } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';
import { TaskDetails } from '../components/tasks/TaskDetails';

export const Completed: React.FC = () => {
  const { tasks, deleteTask, toggleTaskCompletion } = useTasks();
  const { toast } = useToast();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priority: 'All',
    status: 'All', // We ignore this internally for completed view
    sortBy: 'createdAt-desc',
  });

  const handleClearFilters = () => {
    setFilters({
      search: '',
      priority: 'All',
      status: 'All',
      sortBy: 'createdAt-desc',
    });
  };

  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?\n\nThis action cannot be undone.`)) {
      deleteTask(task.id);
      setIsDetailsOpen(false);
      toast('Task deleted successfully', 'success');
    }
  };

  const handleToggleComplete = (taskId: string) => {
    toggleTaskCompletion(taskId);
    toast('Task restored to pending', 'success');
  };

  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...completedTasks];

    // Search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Priority
    if (filters.priority !== 'All') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Sort
    result.sort((a, b) => {
      const priorityMap = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      
      switch (filters.sortBy) {
        case 'createdAt-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'createdAt-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'dueDate-asc':
          if (!a.endTime) return 1;
          if (!b.endTime) return -1;
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        case 'dueDate-desc':
          if (!a.endTime) return 1;
          if (!b.endTime) return -1;
          return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
        case 'priority-desc':
          return priorityMap[b.priority] - priorityMap[a.priority];
        case 'priority-asc':
          return priorityMap[a.priority] - priorityMap[b.priority];
        default:
          return 0;
      }
    });

    return result;
  }, [completedTasks, filters]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Completed Tasks</h2>
        <p className="text-slate-500 mt-1">Review your finished items and accomplishments.</p>
      </div>

      {/* Hide status filter for completed view as it is redundant */}
      <FiltersComponent 
        filters={{...filters, status: 'Completed'}} 
        setFilters={setFilters} 
        onClear={handleClearFilters} 
      />

      <TaskList
        tasks={filteredAndSortedTasks}
        onView={(task) => { setSelectedTask(task); setIsDetailsOpen(true); }}
        onEdit={() => {}} // Cannot edit from completed view, must restore first
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />

      <TaskDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={selectedTask}
        onEdit={() => {}}
      />
    </div>
  );
};
