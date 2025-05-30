// /lib/notification.ts
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for notifications!');
    return;
  }

  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Schedule notifications at specific intervals before task time
export async function scheduleTaskNotifications(task: {
    id: string;
    title: string;
    dueDate: string;
  }) {
    const due = new Date(task.dueDate).getTime();
  
    const intervals = [
      { label: '10 hours', millis: 10 * 60 * 60 * 1000 },
      { label: '1 hour', millis: 60 * 60 * 1000 },
      { label: '10 minutes', millis: 15 * 60 * 1000 },
    ];
  
    const now = Date.now();
  
    await Promise.all(intervals.map(async ({ label, millis }) => {
      const triggerTime = due - millis;
  
      if (triggerTime > now) {
        await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Upcoming Task Reminder',
              body: `Task "${task.title}" is due in ${label}!`,
              data: { taskId: task.id },
            },
            trigger: {
              type: 'date',
              date: new Date(triggerTime),
              repeats: false,
            } as any,
          });
          
      }
    }));
  }
  