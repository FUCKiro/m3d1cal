import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export async function scheduleReminder(appointmentId: string): Promise<boolean> {
  // Skip reminder scheduling in development
  if (import.meta.env.DEV) {
    console.log('Reminder scheduling skipped in development');
    return true;
  }

  try {
    const scheduleReminder = httpsCallable(functions, 'scheduleAppointmentReminder');
    await scheduleReminder({ appointmentId });
    return true;
  } catch (error) {
    console.warn('Reminder scheduling failed:', error);
    // Return true to allow booking to continue even if reminder fails
    return true;
  }
}