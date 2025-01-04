import { collection, addDoc, Timestamp, getFirestore } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';
import type { Appointment } from '../types';

export async function scheduleReminder(appointment: Appointment): Promise<boolean> {
  try {
    // Validate appointment data
    if (!appointment.date || !appointment.time) {
      console.error('Invalid appointment data for reminder');
      return false;
    }

    // Parse appointment date and validate it's in the future
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    if (isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()) {
      console.error('Invalid appointment date for reminder');
      return false;
    }

    // Calculate reminder time (24 hours before)
    const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    
    // Don't schedule if reminder time is in the past
    if (reminderDate <= new Date()) {
      console.warn('Reminder time is in the past, skipping scheduling');
      return false;
    }

    // Create reminder document
    const reminderRef = await addDoc(collection(db, 'reminders'), {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      scheduledFor: Timestamp.fromDate(reminderDate),
      appointmentDate: Timestamp.fromDate(appointmentDate),
      sent: false,
      createdAt: Timestamp.now(),
      status: 'pending'
    });

    // Schedule the reminder via Cloud Function
    const scheduleEmail = httpsCallable(functions, 'scheduleAppointmentReminder');
    await scheduleEmail({ 
      appointmentId: appointment.id,
      reminderId: reminderRef.id,
      scheduledFor: reminderDate.toISOString()
    });

    console.log(`Reminder scheduled successfully for ${reminderDate.toISOString()}`);
    return true;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return false;
  }
}