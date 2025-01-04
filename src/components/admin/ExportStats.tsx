import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { generateAppointmentStats, exportToCSV } from '../../utils/exportData';
import type { AdminAppointment } from '../../types';

interface ExportStatsProps {
  appointments: AdminAppointment[];
}

export default function ExportStats({ appointments }: ExportStatsProps) {
  const stats = generateAppointmentStats(appointments);

  const handleExportCSV = () => {
    exportToCSV(appointments);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Statistiche Appuntamenti
        </h3>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Esporta CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistiche Generali */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Riepilogo Generale
          </h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600 dark:text-gray-300">Totale Appuntamenti:</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">{stats.totalAppointments}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600 dark:text-gray-300">Completati:</dt>
              <dd className="text-sm font-medium text-green-600">{stats.completedAppointments}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600 dark:text-gray-300">Cancellati:</dt>
              <dd className="text-sm font-medium text-red-600">{stats.cancelledAppointments}</dd>
            </div>
          </dl>
        </div>

        {/* Statistiche per Mese */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Ultimi 3 Mesi
          </h4>
          <div className="space-y-4">
            {Object.entries(stats.byMonth).slice(-3).map(([month, data]) => (
              <div key={month} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{month}</h5>
                <dl className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Totale</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{data.total}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Completati</dt>
                    <dd className="text-sm font-medium text-green-600">{data.completed}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiche per Dottore */}
        <div className="md:col-span-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Performance Dottori
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.byDoctor).map(([doctor, data]) => (
              <div key={doctor} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{doctor}</h5>
                <dl className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Totale</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{data.total}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400">Completati</dt>
                    <dd className="text-sm font-medium text-green-600">{data.completed}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}