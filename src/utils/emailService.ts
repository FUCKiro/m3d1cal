import emailjs from '@emailjs/browser';
import type { Appointment } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export async function sendAppointmentReminder(appointment: Appointment, userData: any): Promise<boolean> {
  try {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);

    // Don't send if reminder time is in the past or too close
    if (reminderDate <= new Date()) {
      console.warn('Reminder time is in the past, skipping email');
      return false;
    }

    const templateParams = {
      to_name: `${userData.firstName} ${userData.lastName}`,
      to_email: userData.email,
      appointment_date: format(appointmentDate, 'EEEE d MMMM yyyy', { locale: it }),
      appointment_time: appointment.time,
      doctor_name: appointment.doctorName,
      specialization: appointment.specialization,
      location: appointment.location
    };

    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
}