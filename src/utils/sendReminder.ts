import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export async function scheduleReminder(appointmentId: string) {
  try {
    const scheduleReminder = httpsCallable(functions, 'scheduleAppointmentReminder');
    await scheduleReminder({ appointmentId });
    return true;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return false;
  }
}