import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { AdminAppointment } from '../types';

interface ExportStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  byMonth: {
    [key: string]: {
      total: number;
      completed: number;
      cancelled: number;
      revenue: number;
    }
  };
  byDoctor: {
    [key: string]: {
      total: number;
      completed: number;
      cancelled: number;
    }
  };
}

export function generateAppointmentStats(appointments: AdminAppointment[]): ExportStats {
  const stats: ExportStats = {
    totalAppointments: appointments.length,
    completedAppointments: 0,
    cancelledAppointments: 0,
    byMonth: {},
    byDoctor: {}
  };

  appointments.forEach(appointment => {
    // Count by status
    if (appointment.status === 'completed') stats.completedAppointments++;
    if (appointment.status === 'cancelled') stats.cancelledAppointments++;

    // Group by month
    const monthKey = format(new Date(appointment.date), 'MMMM yyyy', { locale: it });
    if (!stats.byMonth[monthKey]) {
      stats.byMonth[monthKey] = {
        total: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0
      };
    }
    stats.byMonth[monthKey].total++;
    if (appointment.status === 'completed') {
      stats.byMonth[monthKey].completed++;
      stats.byMonth[monthKey].revenue += 100; // Example fixed revenue per appointment
    }
    if (appointment.status === 'cancelled') stats.byMonth[monthKey].cancelled++;

    // Group by doctor
    if (!stats.byDoctor[appointment.doctorName]) {
      stats.byDoctor[appointment.doctorName] = {
        total: 0,
        completed: 0,
        cancelled: 0
      };
    }
    stats.byDoctor[appointment.doctorName].total++;
    if (appointment.status === 'completed') stats.byDoctor[appointment.doctorName].completed++;
    if (appointment.status === 'cancelled') stats.byDoctor[appointment.doctorName].cancelled++;
  });

  return stats;
}

export function exportToCSV(appointments: AdminAppointment[]): void {
  const headers = [
    'Data',
    'Ora',
    'Paziente',
    'Codice Fiscale',
    'Email',
    'Telefono',
    'Dottore',
    'Specializzazione',
    'Stato',
    'Note'
  ];

  const rows = appointments.map(appointment => [
    format(new Date(appointment.date), 'dd/MM/yyyy'),
    appointment.time,
    `${appointment.patient.firstName} ${appointment.patient.lastName}`,
    appointment.patient.fiscalCode,
    appointment.patient.email,
    appointment.patient.phoneNumber,
    appointment.doctorName,
    appointment.specialization,
    appointment.status,
    appointment.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `appuntamenti_${format(new Date(), 'dd_MM_yyyy')}.csv`;
  link.click();
}