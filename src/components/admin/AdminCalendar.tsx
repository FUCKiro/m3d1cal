import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminAppointment } from '../../types';

interface AdminCalendarProps {
  appointments: AdminAppointment[];
  onStatusUpdate: (id: string, status: string) => void;
}

export default function AdminCalendar({ appointments, onStatusUpdate }: AdminCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy', { locale: it })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, i) => {
          const dayAppointments = getAppointmentsForDate(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <div
              key={date.toString()}
              className={`min-h-24 border rounded-lg p-2 bg-white dark:bg-gray-800 ${
                isSelected ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-right">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {format(date, 'd')}
                </span>
              </div>
              <div className="mt-1 space-y-1">
                {dayAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className={`text-xs p-1 rounded ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.time} - Dr. {appointment.doctorName}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Appuntamenti del {format(selectedDate, 'dd MMMM yyyy', { locale: it })}
          </h3>
          <div className="space-y-4">
            {getAppointmentsForDate(selectedDate).map(appointment => (
              <div
                key={appointment.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {appointment.patient.email} • {appointment.patient.phoneNumber}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {appointment.time} - Dr. {appointment.doctorName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {appointment.specialization}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Note: {appointment.notes}
                      </p>
                    )}
                  </div>
                  <select
                    value={appointment.status}
                    onChange={(e) => onStatusUpdate(appointment.id, e.target.value)}
                    className="block w-32 pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-rose-500 focus:border-rose-500 rounded-md bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="scheduled">Programmato</option>
                    <option value="completed">Completato</option>
                    <option value="cancelled">Cancellato</option>
                  </select>
                </div>
              </div>
            ))}
            {getAppointmentsForDate(selectedDate).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Nessun appuntamento per questa data
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}