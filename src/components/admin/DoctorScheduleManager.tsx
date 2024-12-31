import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AlertCircle } from 'lucide-react';
import DoctorSchedule from './DoctorSchedule';
import type { DoctorSchedule as DoctorScheduleType } from '../../types';

interface DoctorScheduleManagerProps {
  doctorId: string;
}

export default function DoctorScheduleManager({ doctorId }: DoctorScheduleManagerProps) {
  const [schedule, setSchedule] = useState<DoctorScheduleType>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchedule();
  }, [doctorId]);

  const loadSchedule = async () => {
    try {
      const scheduleRef = doc(db, 'doctorSchedules', doctorId);
      const scheduleSnap = await getDoc(scheduleRef, { source: 'server' });
      
      if (scheduleSnap.exists()) {
        setSchedule(scheduleSnap.data() as DoctorScheduleType);
      } else {
        // Initialize empty schedule if none exists
        setSchedule({
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: []
        });
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      setError('Errore nel caricamento degli orari');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async (newSchedule: DoctorScheduleType) => {
    try {
      const scheduleRef = doc(db, 'doctorSchedules', doctorId);
      await setDoc(scheduleRef, newSchedule, { merge: true });

      setSchedule(newSchedule);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Orari salvati con successo';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError('Errore nel salvataggio degli orari. Verifica di avere i permessi necessari.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <DoctorSchedule
        doctorId={doctorId}
        schedule={schedule}
        onSave={handleSaveSchedule}
      />
    </div>
  );
}