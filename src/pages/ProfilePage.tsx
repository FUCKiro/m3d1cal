import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AppointmentCard from '../components/profile/AppointmentCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, FileText, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { Appointment } from '../types';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  lastName: z.string().min(2, 'Il cognome deve essere di almeno 2 caratteri'),
  phoneNumber: z.string().min(10, 'Inserisci un numero di telefono valido'),
  birthDate: z.string(),
  address: z.string().min(5, 'Inserisci un indirizzo valido'),
  medicalNotes: z.string().nullable().optional().transform(v => v || ''),
  allergies: z.string().nullable().optional().transform(v => v || ''),
  medications: z.string().nullable().optional().transform(v => v || ''),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'medical' | 'appointments'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function loadUserData() {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            reset({
              ...data,
              medicalNotes: data.medicalNotes || '',
              allergies: data.allergies || '',
              medications: data.medications || ''
            });

            // Carica gli appuntamenti
            const appointmentsRef = collection(db, 'appointments');
            const q = query(
              appointmentsRef,
              where('patientId', '==', user.uid)
            );
            const appointmentsSnap = await getDocs(q);
            let appointmentsData = appointmentsSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Appointment[];
            
            appointmentsData = appointmentsData.sort((a, b) => {
              const dateCompare = a.date.localeCompare(b.date);
              if (dateCompare !== 0) return dateCompare;
              return a.time.localeCompare(b.time);
            });
            
            setAppointments(appointmentsData);
          }
        } catch (error) {
          console.error('Errore nel caricamento dei dati:', error);
          setError('Si è verificato un errore nel caricamento dei dati');
        }
        setLoading(false);
      }
    }
    loadUserData();
  }, [user, reset]);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: 'cancelled'
      });
      
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'cancelled' }
            : appointment
        )
      );
    } catch (error) {
      console.error('Errore durante la cancellazione:', error);
      setError('Si è verificato un errore durante la cancellazione dell\'appuntamento');
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          
          const dataToSave = {
            ...(activeTab === 'profile' ? {
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              birthDate: data.birthDate,
              address: data.address
            } : {}),
            ...(activeTab === 'medical' ? {
              medicalNotes: data.medicalNotes,
              allergies: data.allergies,
              medications: data.medications
            } : {})
          };

          if (!docSnap.exists()) {
            await setDoc(userRef, {
              ...dataToSave,
              email: user.email,
              createdAt: new Date().toISOString()
            });
          } else {
            await updateDoc(userRef, dataToSave);
          }
        
          setUserData(prev => ({ ...prev, ...dataToSave }));
          if (activeTab === 'profile') {
            setIsEditing(false);
          }
          setError(null);

          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          successMessage.textContent = 'Dati salvati con successo';
          document.body.appendChild(successMessage);
          setTimeout(() => successMessage.remove(), 3000);
        } catch (error) {
          console.error('Errore durante il salvataggio:', error);
          setError('Si è verificato un errore durante il salvataggio dei dati');
        }
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del profilo:', error);
      setError('Si è verificato un errore durante l\'aggiornamento del profilo');
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
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base`}
              >
                <User className="h-5 w-5 inline-block mr-2" />
                Profilo
              </button>
              <button
                onClick={() => setActiveTab('medical')}
                className={`${
                  activeTab === 'medical'
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base`}
              >
                <FileText className="h-5 w-5 inline-block mr-2" />
                Storia Clinica
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`${
                  activeTab === 'appointments'
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base`}
              >
                <Calendar className="h-5 w-5 inline-block mr-2" />
                Appuntamenti
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dati Personali</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm text-rose-600 hover:text-rose-500"
                  >
                    {isEditing ? 'Annulla' : 'Modifica'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                        <input
                          {...register('firstName')}
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cognome</label>
                        <input
                          {...register('lastName')}
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefono</label>
                        <input
                          {...register('phoneNumber')}
                          type="tel"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data di Nascita</label>
                        <input
                          {...register('birthDate')}
                          type="date"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                        {errors.birthDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Indirizzo</label>
                        <input
                          {...register('address')}
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                      >
                        Salva Modifiche
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-gray-900 dark:text-white">
                    <ProfileField label="Nome" value={userData?.firstName} />
                    <ProfileField label="Cognome" value={userData?.lastName} />
                    <ProfileField label="Email" value={user?.email} />
                    <ProfileField label="Telefono" value={userData?.phoneNumber} />
                    <ProfileField 
                      label="Data di Nascita" 
                      value={userData?.birthDate ? format(new Date(userData.birthDate), 'dd MMMM yyyy', { locale: it }) : ''}
                    />
                    <ProfileField label="Indirizzo" value={userData?.address} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'medical' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Storia Clinica
                  </h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note Mediche</label>
                    <textarea
                      {...register('medicalNotes')} 
                      rows={4}
                      placeholder="Inserisci eventuali note mediche..."
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allergie</label>
                    <textarea
                      {...register('allergies')}
                      rows={2} 
                      placeholder="Elenca eventuali allergie..."
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farmaci</label>
                    <textarea
                      {...register('medications')}
                      rows={2} 
                      placeholder="Elenca i farmaci che assumi regolarmente..."
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <p className="ml-3 text-sm text-red-700 dark:text-red-200">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                    >
                      Salva Modifiche
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  I Tuoi Appuntamenti
                </h2>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nessun appuntamento</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Non hai ancora prenotato nessun appuntamento.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onCancel={handleCancelAppointment}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{value || '-'}</dd>
    </div>
  );
}