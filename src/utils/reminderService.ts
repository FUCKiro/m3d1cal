import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';
import type { Appointment } from '../types';

export async function scheduleReminder(appointment: Appointment): Promise<boolean> {
  try {
    // Calcola la data del promemoria (24 ore prima dell'appuntamento)
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);

    // Crea il promemoria nel database
    await addDoc(collection(db, 'reminders'), {
      appointmentId: appointment.id,
      scheduledFor: Timestamp.fromDate(reminderDate),
      sent: false,
      createdAt: Timestamp.now()
    });

    // Chiama la Cloud Function per pianificare l'invio dell'email
    const scheduleEmail = httpsCallable(functions, 'scheduleAppointmentReminder');
    await scheduleEmail({ appointmentId: appointment.id });

    return true;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return false;
  }
}