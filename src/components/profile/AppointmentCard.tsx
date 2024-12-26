import React from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import type { Appointment } from '../../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
}

export default function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programmato';
      case 'completed':
        return 'Completato';
      case 'cancelled':
        return 'Cancellato';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Calendar className="h-6 w-6 text-rose-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">
              {appointment.specialization}
            </h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 text-gray-400 mr-2" />
          {format(new Date(`${appointment.date} ${appointment.time}`), 'EEEE d MMMM yyyy, HH:mm', { locale: it })}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          Dr. {appointment.doctorName}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
          Studio {appointment.location}
        </div>
      </div>

      {appointment.notes && (
        <div className="mt-4 text-sm text-gray-500">
          <p className="font-medium">Note:</p>
          <p>{appointment.notes}</p>
        </div>
      )}

      {appointment.status === 'scheduled' && (
        <div className="mt-6">
          <button
            onClick={() => onCancel(appointment.id)}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-rose-600 bg-rose-50 hover:bg-rose-100"
          >
            Cancella Appuntamento
          </button>
        </div>
      )}
    </div>
  );
}