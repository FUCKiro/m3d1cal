import { Resend } from 'resend';
import type { Appointment } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { config } from '../config/env';
import { isDevelopment } from '../utils/environment';

// Helper function to generate email content
function generateEmailContent(appointmentDate: Date, userData: any, appointment: Appointment) {
  return {
    html: `
      <h2>Promemoria Appuntamento</h2>
      <p>Gentile ${userData.firstName} ${userData.lastName},</p>
      <p>Le ricordiamo che ha un appuntamento programmato per domani:</p>
      <ul>
        <li>Data: ${format(appointmentDate, 'EEEE d MMMM yyyy', { locale: it })}</li>
        <li>Ora: ${appointment.time}</li>
        <li>Dottore: Dr. ${appointment.doctorName}</li>
        <li>Specializzazione: ${appointment.specialization}</li>
        <li>Ubicazione: ${appointment.location}</li>
      </ul>
      <p>In caso di impossibilità a presentarsi, la preghiamo di cancellare l'appuntamento con almeno 24 ore di anticipo.</p>
      <p>Cordiali saluti,<br>Centro Medico Plus</p>
    `,
    text: `Promemoria appuntamento per domani ${format(appointmentDate, 'dd/MM/yyyy')} alle ${appointment.time}`
  };
}

export async function sendAppointmentReminder(appointment: Appointment, userData: any): Promise<boolean> {
  try {
    // In development, just log the email and return success
    if (isDevelopment) {
      console.log('Development mode - Email would be sent:', {
        to: userData.email,
        subject: 'Promemoria Appuntamento - Centro Medico Plus',
        appointment: appointment
      });
      return true;
    }
    
    if (!config.resend.apiKey) {
      console.error('Missing Resend API key');
      return false;
    }

    const resend = new Resend(config.resend.apiKey);

    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);

    if (reminderDate <= new Date()) {
      console.warn('Reminder time is in the past or too close, skipping email');
      return false;
    }

    const { html, text } = generateEmailContent(appointmentDate, userData, appointment);

    console.log('Attempting to send email to:', userData.email);
    
    const result = await resend.emails.send({
      from: config.resend.fromEmail,
      to: userData.email,
      subject: 'Promemoria Appuntamento - Centro Medico Plus',
      html,
      text
    });

    if ('error' in result) {
      console.error('Resend API error:', result.error);
      return false;
    }
    
    console.log('Email sent successfully. ID:', result.id);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}