import React, { useState } from 'react';
import { format, isToday, isTomorrow, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar, Clock, User, MapPin, Filter } from 'lucide-react';
import type { AdminAppointment } from '../../types';

interface AdminAppointmentListProps {
  appointments: AdminAppointment[];
  onStatusUpdate: (id: string, status: string) => void;
}

export default function AdminAppointmentList({ appointments, onStatusUpdate }: AdminAppointmentListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Group appointments by date
  const groupedAppointments = appointments.reduce((groups, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {} as { [key: string]: AdminAppointment[] });

  // Sort dates
  const sortedDates = Object.keys(groupedAppointments).sort();

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesSearch = 
      appointment.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient.fiscalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

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
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cerca per dottore o specializzazione..."
            placeholder="Cerca per paziente, dottore o specializzazione..."
            className="w-full px-4 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-rose-500 focus:border-rose-500 text-base sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-rose-500 focus:border-rose-500 rounded-md bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tutti gli stati</option>
            <option value="scheduled">Programmati</option>
            <option value="completed">Completati</option>
            <option value="cancelled">Cancellati</option>
          </select>
        </div>
      </div>

      <div className="space-y-8">
        {sortedDates.map(date => {
          const dateAppointments = groupedAppointments[date].filter(appointment => {
            const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
            const matchesSearch = 
              appointment.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              appointment.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              appointment.patient.fiscalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
              appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              appointment.specialization.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesStatus && matchesSearch;
          });

          if (dateAppointments.length === 0) return null;

          let dateLabel = format(new Date(date), 'EEEE d MMMM yyyy', { locale: it });
          if (isToday(new Date(date))) {
            dateLabel = `Oggi - ${dateLabel}`;
          } else if (isTomorrow(new Date(date))) {
            dateLabel = `Domani - ${dateLabel}`;
          }

          return (
            <div key={date}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-rose-600" />
                {dateLabel}
              </h3>
              <div className="space-y-4">
                {dateAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
            <div className="flex flex-col space-y-4">
              {/* Intestazione con stato e azioni */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                  <span className="hidden sm:inline-block text-sm text-gray-500 dark:text-gray-400">
                    ID: {appointment.id}
                  </span>
                </div>
                <select
                  value={appointment.status}
                  onChange={(e) => onStatusUpdate(appointment.id, e.target.value)}
                  className="block w-32 sm:w-40 pl-2 sm:pl-3 pr-2 sm:pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-rose-500 focus:border-rose-500 rounded-md bg-white dark:bg-gray-700 dark:text-white shadow-sm"
                >
                  <option value="scheduled">Programmato</option>
                  <option value="completed">Completato</option>
                  <option value="cancelled">Cancellato</option>
                </select>
              </div>

              {/* Informazioni paziente */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Informazioni Paziente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nome Completo</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Codice Fiscale</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {appointment.patient.fiscalCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {appointment.patient.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Telefono</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {appointment.patient.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dettagli appuntamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Data</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {format(new Date(appointment.date), 'EEEE d MMMM yyyy', { locale: it })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Ora</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {appointment.time}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">Dottore</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    Dr. {appointment.doctorName}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">Ubicazione</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {appointment.location}
                  </p>
                </div>
              </div>
            </div>

            {appointment.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Note</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>
        ))}
              </div>
            </div>
          );
        })}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nessun appuntamento trovato</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Non ci sono appuntamenti che corrispondono ai criteri di ricerca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}