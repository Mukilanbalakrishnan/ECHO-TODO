import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { Task, TaskFollowUp } from '../types';

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
      
      // Fallback to Web API
      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        try {
          await Notification.requestPermission();
        } catch (e) {
          console.warn('Web notification permission failed:', e);
        }
      }
    };
    
    requestPermissions();
  }, []);

  const scheduleTaskReminder = async (task: Task) => {
    // Only schedule if we have a start time
    if (!task.startTime) return;
    
    const taskTime = new Date(task.startTime);
    const tenMinsBefore = new Date(taskTime.getTime() - 10 * 60000);
    
    try {
      let numericIdBase = 0;
      for (let i = 0; i < task.id.length; i++) {
        numericIdBase += task.id.charCodeAt(i);
      }
      numericIdBase = numericIdBase % 1000000000;

      const notifications = [];

      if (tenMinsBefore.getTime() > Date.now()) {
        notifications.push({
          title: `Task Reminder: ${task.title}`,
          body: `Your task starts in 10 minutes! Priority: ${task.priority}`,
          id: numericIdBase,
          schedule: { at: tenMinsBefore },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        });
      }

      if (taskTime.getTime() > Date.now()) {
        notifications.push({
          title: `Task Started: ${task.title}`,
          body: `It's time to start your task! Priority: ${task.priority}`,
          id: numericIdBase + 1,
          schedule: { at: taskTime },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        });
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
      }
    } catch (error) {
      console.warn('Failed to schedule local notification:', error);
    }
    
    // Schedule for Web API Fallback
    if (tenMinsBefore.getTime() > Date.now()) {
      scheduleWebNotification(tenMinsBefore, `Task Reminder: ${task.title}`, `Your task starts in 10 minutes! Priority: ${task.priority}`);
    }
    if (taskTime.getTime() > Date.now()) {
      scheduleWebNotification(taskTime, `Task Started: ${task.title}`, `It's time to start your task! Priority: ${task.priority}`);
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

  const scheduleWebNotification = (time: Date, title: string, body: string) => {
    const delay = time.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body });
        } else {
          // Fallback to in-app toast if system notifications are blocked
          window.dispatchEvent(new CustomEvent('app-notification', { 
            detail: { message: `${title} - ${body}`, type: 'info' } 
          }));
        }
      }, delay);
    }
  };

  const scheduleFollowUpReminder = async (followUp: TaskFollowUp, taskTitle: string) => {
    if (!followUp.reminderTime) return;
    
    const reminderTarget = new Date(followUp.reminderTime);
    const tenMinsBefore = new Date(reminderTarget.getTime() - 10 * 60000);
    
    try {
      let numericIdBase = 0;
      for (let i = 0; i < followUp.id.length; i++) {
        numericIdBase += followUp.id.charCodeAt(i);
      }
      numericIdBase = numericIdBase % 1000000000;

      const notifications = [];

      if (tenMinsBefore.getTime() > Date.now()) {
        notifications.push({
          title: `Follow-Up in 10 mins: ${taskTitle}`,
          body: followUp.content,
          id: numericIdBase,
          schedule: { at: tenMinsBefore },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        });
      }

      if (reminderTarget.getTime() > Date.now()) {
        notifications.push({
          title: `Follow-Up Now: ${taskTitle}`,
          body: followUp.content,
          id: numericIdBase + 1,
          schedule: { at: reminderTarget },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        });
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
      }
    } catch (error) {
      console.warn('Failed to schedule local notification:', error);
    }
    
    // Schedule for Web API Fallback
    if (tenMinsBefore.getTime() > Date.now()) {
      scheduleWebNotification(tenMinsBefore, `Follow-Up in 10 mins: ${taskTitle}`, followUp.content);
    }
    if (reminderTarget.getTime() > Date.now()) {
      scheduleWebNotification(reminderTarget, `Follow-Up Now: ${taskTitle}`, followUp.content);
    }
  };

  return { scheduleTaskReminder, cancelTaskReminder, scheduleFollowUpReminder };
};
