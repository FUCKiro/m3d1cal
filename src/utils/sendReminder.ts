import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export async function scheduleReminder(appointmentId: string): Promise<boolean> {
  try {
    const scheduleReminder = httpsCallable(functions, 'scheduleAppointmentReminder');
    await scheduleReminder({ appointmentId });
    return true;
  } catch (error) {
    // Log error but don't throw to prevent booking interruption
    console.error('Error scheduling reminder:', error); 
    return false;
  }
}