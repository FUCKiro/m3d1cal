import emailjs from '@emailjs/browser';
import type { Appointment } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { config } from '../config/env';

export async function sendAppointmentReminder(appointment: Appointment, userData: any): Promise<boolean> {
  try {
    console.log('EmailJS Config:', {
      serviceId: config.emailjs.serviceId,
      templateId: config.emailjs.templateId,
      hasPublicKey: !!config.emailjs.publicKey
    });

    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const formattedDate = format(appointmentDate, 'EEEE d MMMM yyyy', { locale: it });

    const templateParams = {
      to_name: userData.firstName + ' ' + userData.lastName,
      to_email: userData.email,
      appointment_date: formattedDate,
      appointment_time: appointment.time,
      doctor_name: appointment.doctorName,
      specialization: appointment.specialization,
      location: appointment.location
    };

    console.log('EmailJS Template Params:', templateParams);

    const result = await emailjs.send(
      config.emailjs.serviceId,
      config.emailjs.templateId,
      templateParams,
      config.emailjs.publicKey
    );

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
}