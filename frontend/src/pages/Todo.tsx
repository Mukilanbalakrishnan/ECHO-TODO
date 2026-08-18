import React, { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../contexts/ToastContext';
import type { FilterState } from '../components/tasks/TaskFilters';
import type { Task } from '../types';
import { TaskStats } from '../components/tasks/TaskStats';
import { TaskFilters as FiltersComponent } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetails } from '../components/tasks/TaskDetails';
import { Button } from '../components/common/Button';
import { Plus } from 'lucide-react';

export const Todo: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priority: 'All',
    status: 'All',
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

  const handleSaveTask = (task: Task) => {
    if (taskToEdit) {
      updateTask(task);
      toast('Task updated successfully', 'success');
    } else {
      addTask(task);
      toast('Task created successfully', 'success');
    }
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsDetailsOpen(false);
    setIsModalOpen(true);
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
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const isCompleting = task.status !== 'Completed';
      toast(isCompleting ? 'Task marked as completed' : 'Task restored to pending', 'success');
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

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

    // Status
    if (filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status);
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
  }, [tasks, filters]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Tasks</h2>
          <p className="text-slate-500 mt-1">Stay organized and get things done.</p>
        </div>
        <Button onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }} className="gap-2">
          <Plus size={18} />
          Add Task
        </Button>
      </div>

      <TaskStats tasks={tasks} />

      <FiltersComponent filters={filters} setFilters={setFilters} onClear={handleClearFilters} />

      <TaskList
        tasks={filteredAndSortedTasks}
        onView={(task) => { setSelectedTask(task); setIsDetailsOpen(true); }}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        onAddFirst={() => { setTaskToEdit(null); setIsModalOpen(true); }}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
        onSave={handleSaveTask}
        task={taskToEdit}
      />

      <TaskDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={selectedTask}
        onEdit={() => selectedTask && handleEditTask(selectedTask)}
      />
    </div>
  );
};
