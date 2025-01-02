import React, { useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Clock, Calendar, Save, Plus, X } from 'lucide-react';
import type { DoctorSchedule } from '../../types';

interface DoctorScheduleProps {
  doctorId: string;
  schedule: DoctorSchedule;
  onSave: (schedule: DoctorSchedule) => void;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

const weekDays = [
  { id: 'monday', label: 'Lunedì' },
  { id: 'tuesday', label: 'Martedì' },
  { id: 'wednesday', label: 'Mercoledì' },
  { id: 'thursday', label: 'Giovedì' },
  { id: 'friday', label: 'Venerdì' },
  { id: 'saturday', label: 'Sabato' }
];

export default function DoctorSchedule({ doctorId, schedule, onSave }: DoctorScheduleProps) {
  const [editedSchedule, setEditedSchedule] = useState<DoctorSchedule>(schedule);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleAddTimeSlot = (day: string, time: string) => {
    setEditedSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), time].sort()
    }));
  };

  const handleRemoveTimeSlot = (day: string, time: string) => {
    setEditedSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(t => t !== time)
    }));
  };

  const handleSave = () => {
    onSave(editedSchedule);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Gestione Orari
          </h3>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Salva Modifiche
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista giorni */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Seleziona Giorno
            </h4>
            {weekDays.map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border ${
                  selectedDay === day.id
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {day.label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {editedSchedule[day.id]?.length || 0} slot
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Gestione slot orari */}
          {selectedDay && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Slot Orari - {weekDays.find(d => d.id === selectedDay)?.label}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {timeSlots.map(time => {
                  const isSelected = editedSchedule[selectedDay]?.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveTimeSlot(selectedDay, time);
                        } else {
                          handleAddTimeSlot(selectedDay, time);
                        }
                      }}
                      className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
                        isSelected
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {time}
                      {isSelected ? (
                        <X className="h-4 w-4 ml-2" />
                      ) : (
                        <Plus className="h-4 w-4 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}