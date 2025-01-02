import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, updateDoc, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AdminAppointmentList from '../components/admin/AdminAppointmentList';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminCalendar from '../components/admin/AdminCalendar';
import { CalendarDays, List, AlertCircle, Users, LayoutDashboard, UserCog } from 'lucide-react';
import type { AdminAppointment } from '../types';
import type { User } from '../types';
import AdminPatientList from '../components/admin/AdminPatientList';
import DoctorManager from '../components/admin/DoctorManager';

export default function AdminPage() {
  const [view, setView] = useState<'dashboard' | 'list' | 'calendar' | 'patients' | 'doctors'>('dashboard');
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    loadAppointments();
    loadPatients();
  }, [user, navigate]);

  const loadPatients = async () => {
    try {
      const patientsSnapshot = await getDocs(
        collection(db, 'users')
      );
      
      const patientsData = patientsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.role === 'patient' || !user.role) as User[];
      
      setPatients(patientsData);
    } catch (error) {
      console.error('Errore nel caricamento dei pazienti:', error);
      setError('Si è verificato un errore nel caricamento dei pazienti.');
    }
  };

  const loadAppointments = async () => {
    setError(null);
    try {
      // Get all appointments
      const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
      
      // Create a map of patient IDs to avoid duplicate fetches
      const patientIds = new Set(appointmentsSnapshot.docs.map(doc => doc.data().patientId));
      
      // Fetch all patient data at once
      const patientsData = new Map();
      await Promise.all(Array.from(patientIds).map(async (patientId) => {
        try {
          const patientDoc = await getDoc(doc(db, 'users', patientId));
          if (patientDoc.exists()) {
            patientsData.set(patientId, patientDoc.data());
          }
        } catch (error) {
          console.error(`Errore nel caricamento dei dati del paziente ${patientId}:`, error);
        }
      }));

      // Map appointments with patient data
      const appointmentsData = appointmentsSnapshot.docs.map(doc => {
        const appointmentData = { ...doc.data(), id: doc.id };
        const patientData = patientsData.get(appointmentData.patientId);

        return {
          ...appointmentData,
          patient: patientData ? {
            firstName: patientData.firstName || 'N/D',
            lastName: patientData.lastName || 'N/D',
            email: patientData.email || 'N/D',
            phoneNumber: patientData.phoneNumber || 'N/D',
            fiscalCode: patientData.fiscalCode || 'N/D'
          } : {
            firstName: 'Paziente',
            lastName: 'Non Trovato',
            email: 'N/D',
            phoneNumber: 'N/D',
            fiscalCode: 'N/D'
          },
          date: appointmentData.date || new Date().toISOString().split('T')[0],
          time: appointmentData.time || '00:00',
          status: appointmentData.status || 'scheduled',
          specialization: appointmentData.specialization || 'Non specificata',
          location: appointmentData.location || 'Non specificata',
          doctorName: appointmentData.doctorName || 'Non specificato',
          notes: appointmentData.notes || '',
          createdAt: appointmentData.createdAt || new Date().toISOString()
        };
      });
      
      // Sort appointments by date and time in memory
      const sortedAppointments = appointmentsData.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('Errore nel caricamento degli appuntamenti:', error);
      setError('Si è verificato un errore nel caricamento dei dati. Ricarica la pagina o riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { status: newStatus });
      
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato:', error);
      setError('Si è verificato un errore nell\'aggiornamento dello stato. Riprova più tardi.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestione Appuntamenti
              </h2>
              <div className="flex items-center mt-4 sm:mt-0">
                <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setView('dashboard')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'dashboard'
                        ? 'bg-rose-600 text-white dark:bg-rose-700'
                        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center`}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setView('doctors')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'doctors'
                        ? 'bg-rose-600 text-white dark:bg-rose-700'
                        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center`}
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Dottori
                  </button>
                  <button
                    onClick={() => setView('patients')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'patients'
                        ? 'bg-rose-600 text-white dark:bg-rose-700'
                        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Pazienti
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'list'
                        ? 'bg-rose-600 text-white dark:bg-rose-700'
                        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center`}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Lista
                  </button>
                  <button
                    onClick={() => setView('calendar')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'calendar'
                        ? 'bg-rose-600 text-white dark:bg-rose-700'
                        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center`}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Calendario
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 dark:text-gray-300">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {view === 'dashboard' ? (
              <AdminDashboard appointments={appointments} patients={patients} />
            ) : view === 'patients' ? (
              <AdminPatientList patients={patients} />
            ) : view === 'doctors' ? (
              <DoctorManager />
            ) : view === 'list' ? (
              <AdminAppointmentList
                appointments={appointments}
                onStatusUpdate={handleStatusUpdate}
              />
            ) : (
              <AdminCalendar
                appointments={appointments}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}