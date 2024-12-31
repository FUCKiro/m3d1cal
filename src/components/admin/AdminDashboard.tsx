import React from 'react';
import { BarChart, Users, Calendar, TrendingUp, Activity, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { AdminAppointment, User } from '../../types';

interface AdminDashboardProps {
  appointments: AdminAppointment[];
  patients: User[];
}

export default function AdminDashboard({ appointments, patients }: AdminDashboardProps) {
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(app => app.status === 'completed').length;
  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled').length;
  
  const completionRate = totalAppointments > 0 
    ? Math.round((completedAppointments / totalAppointments) * 100) 
    : 0;

  const stats = [
    {
      title: "Pazienti Totali",
      value: totalPatients,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      change: "+12% rispetto al mese scorso"
    },
    {
      title: "Appuntamenti Totali",
      value: totalAppointments,
      icon: <Calendar className="h-6 w-6 text-green-600" />,
      change: "+5% rispetto al mese scorso"
    },
    {
      title: "Tasso di Completamento",
      value: `${completionRate}%`,
      icon: <Activity className="h-6 w-6 text-rose-600" />,
      change: "+3% rispetto al mese scorso"
    },
    {
      title: "Tempo Medio Visita",
      value: "45 min",
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      change: "Stabile rispetto al mese scorso"
    }
  ];

  const recentAppointments = appointments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Ultimi Appuntamenti
          </h3>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentAppointments.map((appointment) => (
            <li key={appointment.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {appointment.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : appointment.status === 'cancelled' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Dr. {appointment.doctorName} - {appointment.specialization}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {format(new Date(appointment.date), 'd MMMM yyyy', { locale: it })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {appointment.time}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}