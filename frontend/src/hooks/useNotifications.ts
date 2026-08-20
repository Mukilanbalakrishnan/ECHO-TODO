import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import type { Task, TaskFollowUp } from '../types';

export const useNotifications = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const { display } = await LocalNotifications.checkPermissions();
          if (display !== 'granted') {
            await LocalNotifications.requestPermissions();
          }
          
          try {
            const exactPerm = await LocalNotifications.checkExactNotificationSetting();
            if (exactPerm.exact_alarm !== 'granted') {
              await LocalNotifications.changeExactNotificationSetting();
            }
          } catch (exactErr) {
            console.warn('Exact alarm permission check not supported or failed', exactErr);
          }
          
          try {
            await LocalNotifications.createChannel({
              id: 'task-reminders-v2',
              name: 'Task Reminders',
              description: 'Important reminders for your tasks',
              importance: 5,
              visibility: 1,
            });
          } catch (e) {
            console.warn('Failed to create notification channel:', e);
          }
          
          // Show toast if a notification fires while the user has the app open
          LocalNotifications.addListener('localNotificationReceived', (notification) => {
            window.dispatchEvent(new CustomEvent('app-notification', { 
              detail: { message: `${notification.title} - ${notification.body}`, type: 'info' } 
            }));
          });
        }
      } catch (error) {
        console.warn('LocalNotifications permissions could not be requested:', error);
      }
      
      // Fallback to Web API for browsers
      if (!Capacitor.isNativePlatform() && 'Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
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
    const numericIdRoot = parseInt(task.id.replace(/-/g, '').substring(0, 8), 16) % 2000000000;
    
    // Process Start Time
    if (task.startTime) {
      const taskTime = new Date(task.startTime);
      const tenMinsBefore = new Date(taskTime.getTime() - 10 * 60000);
      
      try {
        const notifications = [];

        if (tenMinsBefore.getTime() > Date.now()) {
          notifications.push({
            title: `Task Reminder: ${task.title}`,
            body: `Your task starts in 10 minutes! Priority: ${task.priority}`,
            id: numericIdRoot,
            schedule: { at: tenMinsBefore, allowWhileIdle: true },
            channelId: 'task-reminders-v2',
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
            id: numericIdRoot + 1,
            schedule: { at: taskTime, allowWhileIdle: true },
            channelId: 'task-reminders-v2',
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null,
          });
        }

        if (notifications.length > 0) {
          await LocalNotifications.schedule({ notifications });
        }
      } catch (error: any) {
        alert('Start Notification Error: ' + (error.message || 'Unknown error'));
        console.warn('Failed to schedule start time notification:', error);
      }
      
      if (tenMinsBefore.getTime() > Date.now()) {
        scheduleWebNotification(tenMinsBefore, `Task Reminder: ${task.title}`, `Your task starts in 10 minutes! Priority: ${task.priority}`);
      }
      if (taskTime.getTime() > Date.now()) {
        scheduleWebNotification(taskTime, `Task Started: ${task.title}`, `It's time to start your task! Priority: ${task.priority}`);
      }
    }
    
    // Process End Time / Due Date
    if (task.endTime) {
      const endTime = new Date(task.endTime);
      const tenMinsBeforeEnd = new Date(endTime.getTime() - 10 * 60000);
      
      try {
        const endNotifications = [];

        if (tenMinsBeforeEnd.getTime() > Date.now()) {
          endNotifications.push({
            title: `Task Due Soon: ${task.title}`,
            body: `Your task is due in 10 minutes! Priority: ${task.priority}`,
            id: numericIdRoot + 2,
            schedule: { at: tenMinsBeforeEnd, allowWhileIdle: true },
            channelId: 'task-reminders-v2',
          });
        }

        if (endTime.getTime() > Date.now()) {
          endNotifications.push({
            title: `Task Deadline: ${task.title}`,
            body: `Your task is due now! Priority: ${task.priority}`,
            id: numericIdRoot + 3,
            schedule: { at: endTime, allowWhileIdle: true },
            channelId: 'task-reminders-v2',
          });
        }

        if (endNotifications.length > 0) {
          await LocalNotifications.schedule({ notifications: endNotifications });
        }
      } catch (error: any) {
        alert('End Notification Error: ' + (error.message || 'Unknown error'));
        console.warn('Failed to schedule end time notification:', error);
      }
      
      if (tenMinsBeforeEnd.getTime() > Date.now()) {
        scheduleWebNotification(tenMinsBeforeEnd, `Task Due Soon: ${task.title}`, `Your task is due in 10 minutes! Priority: ${task.priority}`);
      }
      if (endTime.getTime() > Date.now()) {
        scheduleWebNotification(endTime, `Task Deadline: ${task.title}`, `Your task is due now! Priority: ${task.priority}`);
      }
    }
  };
    

  const cancelTaskReminder = async (taskId: string) => {
    try {
      const numericIdRoot = parseInt(taskId.replace(/-/g, '').substring(0, 8), 16) % 2000000000;

      await LocalNotifications.cancel({ 
        notifications: [
          { id: numericIdRoot },
          { id: numericIdRoot + 1 },
          { id: numericIdRoot + 2 },
          { id: numericIdRoot + 3 }
        ] 
      });
    } catch (error) {
      console.warn('Failed to cancel local notification:', error);
    }
  };

  const scheduleWebNotification = (time: Date, title: string, body: string) => {
    if (Capacitor.isNativePlatform()) return;
    
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
      // Create a unique integer ID from the first 8 characters of the UUID
      const numericIdBase = parseInt(followUp.id.replace(/-/g, '').substring(0, 8), 16) % 2000000000;

      const notifications = [];

      if (tenMinsBefore.getTime() > Date.now()) {
        notifications.push({
          title: `Follow-Up in 10 mins: ${taskTitle}`,
          body: followUp.content,
          id: numericIdBase,
          schedule: { at: tenMinsBefore, allowWhileIdle: true },
          channelId: 'task-reminders-v2',
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
          schedule: { at: reminderTarget, allowWhileIdle: true },
          channelId: 'task-reminders-v2',
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        });
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
      }
    } catch (error: any) {
      alert('Follow-Up Notification Error: ' + (error.message || 'Unknown error'));
      console.error('Failed to schedule follow-up notification:', error);
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
