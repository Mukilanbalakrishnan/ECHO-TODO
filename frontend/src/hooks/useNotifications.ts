import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { Task } from '../types';

export const useNotifications = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }
      } catch (error) {
        console.warn('LocalNotifications permissions could not be requested, probably running in web browser:', error);
      }
    };
    
    requestPermissions();
  }, []);

  const scheduleTaskReminder = async (task: Task) => {
    // Only schedule if we have a start time
    if (!task.startTime) return;
    
    const taskTime = new Date(task.startTime);
    // Let's schedule the notification 10 minutes before the task starts
    const reminderTime = new Date(taskTime.getTime() - 10 * 60000);
    
    // Don't schedule if it's already in the past
    if (reminderTime.getTime() < Date.now()) return;

    try {
      // Generate a numeric ID from the UUID string
      let numericId = 0;
      for (let i = 0; i < task.id.length; i++) {
        numericId += task.id.charCodeAt(i);
      }
      // Ensure it's a valid 32-bit int
      numericId = numericId % 2147483647;

      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Task Reminder: ${task.title}`,
            body: `Your task starts in 10 minutes! Priority: ${task.priority}`,
            id: numericId,
            schedule: { at: reminderTime },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null,
          }
        ]
      });
      console.log('Scheduled local notification for task:', task.title);
    } catch (error) {
      console.warn('Failed to schedule local notification:', error);
    }
  };

  const cancelTaskReminder = async (taskId: string) => {
    try {
      let numericId = 0;
      for (let i = 0; i < taskId.length; i++) {
        numericId += taskId.charCodeAt(i);
      }
      numericId = numericId % 2147483647;

      await LocalNotifications.cancel({ notifications: [{ id: numericId }] });
    } catch (error) {
      console.warn('Failed to cancel local notification:', error);
    }
  };

  return { scheduleTaskReminder, cancelTaskReminder };
};
