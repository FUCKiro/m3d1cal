import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

export const scheduleAppointmentReminder = functions.https.onCall(async (data, context) => {
  const { appointmentId } = data;
  
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const appointmentRef = admin.firestore().collection('appointments').doc(appointmentId);
    const appointment = await appointmentRef.get();
    
    if (!appointment.exists) {
      throw new functions.https.HttpsError('not-found', 'Appointment not found');
    }

    const appointmentData = appointment.data()!;
    const userRef = admin.firestore().collection('users').doc(appointmentData.patientId);
    const user = await userRef.get();
    
    if (!user.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = user.data()!;
    
    // Schedule the reminder for 24 hours before the appointment
    const appointmentDate = new Date(`${appointmentData.date}T${appointmentData.time}`);
    const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);

    // Create a scheduled task
    await admin.firestore().collection('reminders').add({
      appointmentId,
      scheduledFor: reminderDate,
      sent: false
    });

    return { success: true };
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    throw new functions.https.HttpsError('internal', 'Error scheduling reminder');
  }
});

export const sendAppointmentReminders = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  const now = new Date();
  const remindersRef = admin.firestore().collection('reminders');
  
  const pendingReminders = await remindersRef
    .where('sent', '==', false)
    .where('scheduledFor', '<=', now)
    .get();

  const reminderPromises = pendingReminders.docs.map(async (doc) => {
    const reminder = doc.data();
    const appointmentRef = admin.firestore().collection('appointments').doc(reminder.appointmentId);
    const appointment = await appointmentRef.get();

    if (!appointment.exists) return;

    const appointmentData = appointment.data()!;
    const userRef = admin.firestore().collection('users').doc(appointmentData.patientId);
    const user = await userRef.get();

    if (!user.exists) return;

    const userData = user.data()!;

    // Send email reminder
    const mailOptions = {
      from: '"Centro Medico Plus" <noreply@centromedicoplus.it>',
      to: userData.email,
      subject: 'Promemoria Appuntamento - Centro Medico Plus',
      html: `
        <h2>Promemoria Appuntamento</h2>
        <p>Gentile ${userData.firstName} ${userData.lastName},</p>
        <p>Le ricordiamo che ha un appuntamento programmato per domani:</p>
        <ul>
          <li>Data: ${format(new Date(appointmentData.date), 'EEEE d MMMM yyyy', { locale: it })}</li>
          <li>Ora: ${appointmentData.time}</li>
          <li>Dottore: Dr. ${appointmentData.doctorName}</li>
          <li>Specializzazione: ${appointmentData.specialization}</li>
          <li>Ubicazione: ${appointmentData.location}</li>
        </ul>
        <p>In caso di impossibilità a presentarsi, la preghiamo di cancellare l'appuntamento con almeno 24 ore di anticipo.</p>
        <p>Cordiali saluti,<br>Centro Medico Plus</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      await doc.ref.update({ sent: true });
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  });

  await Promise.all(reminderPromises);
});