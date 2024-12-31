import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AlertCircle } from 'lucide-react';
import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';
import DoctorScheduleManager from './DoctorScheduleManager';
import type { User } from '../../types';

export default function DoctorManager() {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'doctor'));
      const querySnapshot = await getDocs(q);
      const doctorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setError('Errore nel caricamento dei dottori');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setShowForm(true);
  };

  const handleEditDoctor = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setShowForm(true);
    }
  };

  const handleSchedule = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setShowSchedule(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedDoctor) {
        // Update existing doctor
        const doctorRef = doc(db, 'users', selectedDoctor.id);
        await updateDoc(doctorRef, {
          ...data,
          role: 'doctor'
        });
      } else {
        // Add new doctor
        const doctorRef = doc(collection(db, 'users'));
        await setDoc(doctorRef, {
          ...data,
          role: 'doctor',
          createdAt: new Date().toISOString()
        });
      }
      
      await loadDoctors();
      setShowForm(false);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = selectedDoctor ? 'Dottore aggiornato con successo' : 'Dottore aggiunto con successo';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (error) {
      console.error('Error saving doctor:', error);
      setError('Errore nel salvataggio dei dati');
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      const batch = writeBatch(db);

      // Delete doctor's schedule
      const scheduleRef = doc(db, 'doctorSchedules', doctorId);
      batch.delete(scheduleRef);

      // Delete doctor's appointments
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId)
      );
      const appointmentsSnap = await getDocs(appointmentsQuery);
      appointmentsSnap.forEach(appointment => {
        batch.delete(doc(db, 'appointments', appointment.id));
      });

      // Delete doctor's user document
      const doctorRef = doc(db, 'users', doctorId);
      batch.delete(doctorRef);

      // Commit all deletions in a single batch
      await batch.commit();

      // Update local state
      setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== doctorId));

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Dottore eliminato con successo';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Errore durante l\'eliminazione del dottore. Riprova più tardi.');
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

      {showSchedule && selectedDoctorId ? (
        <div>
          <button
            onClick={() => setShowSchedule(false)}
            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Torna alla lista
          </button>
          <DoctorScheduleManager doctorId={selectedDoctorId} />
        </div>
      ) : (
        <DoctorList
          doctors={doctors}
          onEdit={handleEditDoctor}
          onSchedule={handleSchedule}
          onDelete={handleDeleteDoctor}
          onAdd={handleAddDoctor}
        />
      )}

      {showForm && (
        <DoctorForm
          initialData={selectedDoctor || undefined}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}