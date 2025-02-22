import React, { useState } from 'react';
import { Search, Plus, Edit, Calendar, Trash2, MoreVertical, X } from 'lucide-react';
import type { User } from '../../types';

interface DoctorListProps {
  doctors: User[];
  onEdit: (doctorId: string) => void;
  onSchedule: (doctorId: string) => void;
  onDelete: (doctorId: string) => void;
  onAdd: () => void;
}

export default function DoctorList({ doctors, onEdit, onSchedule, onDelete, onAdd }: DoctorListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const filteredDoctors = doctors.filter(doctor => {
    const searchString = searchTerm.toLowerCase();
    return (
      doctor.firstName.toLowerCase().includes(searchString) ||
      doctor.lastName.toLowerCase().includes(searchString) ||
      (doctor.specialization && doctor.specialization.toLowerCase().includes(searchString))
    );
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cerca per nome o specializzazione..."
            className="block w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-rose-500 focus:border-rose-500 text-base sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={onAdd}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Dottore
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Specializzazione
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stato
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Azioni</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <div 
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer sm:cursor-default flex items-center justify-between"
                    onClick={() => setSelectedDoctor(selectedDoctor === doctor.id ? null : doctor.id)}
                  >
                    {doctor.firstName} {doctor.lastName}
                    <MoreVertical className="h-4 w-4 sm:hidden ml-2 text-gray-400" />
                  </div>
                  {selectedDoctor === doctor.id && (
                    <div className="absolute left-0 right-0 mt-2 py-2 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 sm:hidden">
                      <button
                        onClick={() => {
                          onEdit(doctor.id);
                          setSelectedDoctor(null);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          onSchedule(doctor.id);
                          setSelectedDoctor(null);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Orari
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Sei sicuro di voler eliminare questo dottore? Questa azione non può essere annullata.')) {
                            onDelete(doctor.id);
                          }
                          setSelectedDoctor(null);
                        }}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Elimina
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {doctor.specialization || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {doctor.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Attivo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hidden sm:flex justify-end space-x-3">
                  <button
                    onClick={() => onEdit(doctor.id)}
                    className="text-rose-600 hover:text-rose-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onSchedule(doctor.id)}
                    className="text-rose-600 hover:text-rose-900 ml-4"
                  >
                    <Calendar className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Sei sicuro di voler eliminare questo dottore? Questa azione non può essere annullata.')) {
                        onDelete(doctor.id);
                      }
                    }}
                    className="text-rose-600 hover:text-rose-900 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Nessun dottore trovato
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aggiungi un nuovo dottore o modifica i criteri di ricerca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}