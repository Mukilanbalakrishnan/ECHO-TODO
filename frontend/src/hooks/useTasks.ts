import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { useNotifications } from './useNotifications';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scheduleTaskReminder, cancelTaskReminder, scheduleFollowUpReminder } = useNotifications();

  const fetchTasks = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        
        // Sync local notifications for tasks created on other devices
        data.forEach((task: Task) => {
          if (task.status !== 'Completed') {
            scheduleTaskReminder(task);
            if (task.followUps) {
              task.followUps.forEach((f) => scheduleFollowUpReminder(f, task.title));
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task: Task) => {
    // Optimistic update
    setTasks((prev) => [task, ...prev]);
    // Schedule notification
    scheduleTaskReminder(task);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
    } catch (error) {
      console.error('Failed to add task:', error);
      fetchTasks(); // Revert on failure
    }
  };

  const updateTask = async (updatedTask: Task) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    
    // Reschedule notifications for the updated task
    cancelTaskReminder(updatedTask.id).then(() => {
      if (updatedTask.status !== 'Completed') {
        scheduleTaskReminder(updatedTask);
      }
    });

    try {
      await fetch(`/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      fetchTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    // Cancel notification
    cancelTaskReminder(taskId);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      fetchTasks();
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const taskToToggle = tasks.find(t => t.id === taskId);
    if (!taskToToggle) return;
    
    const isCompleted = taskToToggle.status === 'Completed';
    const updatedStatus = isCompleted ? 'Pending' : 'Completed';
    
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) => 
        task.id === taskId ? { ...task, status: updatedStatus } : task
      )
    );
    
    if (updatedStatus === 'Completed') {
      cancelTaskReminder(taskId);
    } else {
      scheduleTaskReminder(taskToToggle);
    }
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskToToggle, status: updatedStatus })
      });
    } catch (error) {
      console.error('Failed to toggle task:', error);
      fetchTasks();
    }
  };

  const addFollowUp = async (task: Task, content: string, reminderTime?: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/tasks/${task.id}/follow-ups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, reminderTime })
      });
      
      if (response.ok) {
        const newFollowUp = await response.json();
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? { ...t, followUps: [...(t.followUps || []), newFollowUp] }
              : t
          )
        );
        if (newFollowUp.reminderTime) {
          scheduleFollowUpReminder(newFollowUp, task.title);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add follow-up:', error);
      return false;
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    addFollowUp,
    isLoaded,
  };
};
