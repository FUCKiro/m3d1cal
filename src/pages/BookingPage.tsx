import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, AlertCircle } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendAppointmentReminder } from '../utils/emailService';
import type { DoctorSchedule } from '../types';

interface BookedTimeSlot {
  date: string;
  time: string;
}

const bookingSchema = z.object({
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, specialist, adminBooking, patient } = location.state || {};
  const [bookedSlots, setBookedSlots] = useState<BookedTimeSlot[]>([]);
  const [doctorSchedule, setDoctorSchedule] = useState<DoctorSchedule>({});
  const [error, setError] = useState<string>('');
  const [isDoctorAvailable, setIsDoctorAvailable] = useState<boolean>(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });

  const selectedDate = watch('date');

  // Load doctor's schedule
  useEffect(() => {
    const loadDoctorSchedule = async () => {
      if (specialist?.id) {
        try {
          // First check if doctor is available
          const doctorRef = doc(db, 'users', specialist.id);
          const doctorSnap = await getDoc(doctorRef);
          
          if (doctorSnap.exists()) {
            const doctorData = doctorSnap.data();
            setIsDoctorAvailable(doctorData.isAvailable ?? true);
            
            if (doctorData.isAvailable === false) {
              setError('Questo dottore non è al momento disponibile per nuove prenotazioni.');
              return;
            }
            
            // If doctor is available, load their schedule
            const scheduleRef = doc(db, 'doctorSchedules', specialist.id);
            const scheduleSnap = await getDoc(scheduleRef);
            if (scheduleSnap.exists()) {
              setDoctorSchedule(scheduleSnap.data() as DoctorSchedule);
            } else {
              setError('Questo dottore non ha ancora configurato i suoi orari.');
            }
          } else {
            setError('Dottore non trovato.');
            setIsDoctorAvailable(false);
          }
        } catch (error) {
          console.error('Error loading doctor schedule:', error);
          setError('Non è stato possibile caricare gli orari disponibili. Riprova più tardi.');
        }
      }
    };

    loadDoctorSchedule();
  }, [specialist?.id]);

  // Load booked slots when date changes
  const loadBookedSlots = async (date: string) => {
    if (!specialist?.id) return;
    
    setLoadingSlots(true);
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('doctorId', '==', specialist.id),
        where('date', '==', date),
        where('status', '==', 'scheduled')
      );

      const querySnapshot = await getDocs(q);
      const slots = querySnapshot.docs.map(doc => ({
        date: doc.data().date,
        time: doc.data().time
      }));
      setBookedSlots(slots);
    } catch (error) {
      console.error('Error loading booked slots:', error);
      setError('Errore nel caricamento degli orari disponibili');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date: string) => {
    if (!date) return [];
    
    const dayIndex = new Date(date).getDay();
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayIndex];
    
    return doctorSchedule[dayName] || [];
  };

  const isTimeSlotBooked = (date: string, time: string) => {
    return bookedSlots.some(slot => 
      slot.date === date && slot.time === time
    );
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (!service && !specialist) {
      navigate('/');
    }
  }, [service, specialist, navigate, user, location]);

  // Load booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      if (!specialist?.id) {
        setError('Dati dello specialista mancanti');
        return;
      }

      const availableSlots = getAvailableTimeSlots(data.date);
      if (!availableSlots.includes(data.time)) {
        setError('Orario non disponibile per questa data');
        return;
      }

      // Check for existing appointments at the same time
      const appointmentsRef = collection(db, 'appointments');
      const existingAppointmentsQuery = query(
        appointmentsRef,
        where('date', '==', data.date),
        where('time', '==', data.time),
        where('status', '==', 'scheduled'),
        where('doctorId', '==', specialist?.id || '')
      );

      const existingAppointments = await getDocs(existingAppointmentsQuery);
      
      if (!existingAppointments.empty) {
        setError('Questo orario non è più disponibile. Seleziona un altro orario.');
        return;
      }

      // Check if user already has an appointment at the same time
      const userAppointmentsQuery = query(
        appointmentsRef,
        where('date', '==', data.date),
        where('time', '==', data.time),
        where('status', '==', 'scheduled'),
        where('patientId', '==', user.uid)
      );

      const userAppointments = await getDocs(userAppointmentsQuery);

      if (!userAppointments.empty) {
        setError('Hai già un appuntamento prenotato in questo orario.');
        return;
      }

      const appointmentData = {
        patientId: adminBooking ? patient.id : user.uid,
        doctorId: specialist?.id || '',
        doctorName: specialist ? `${specialist.firstName} ${specialist.lastName}` : '',
        specialization: specialist?.specialization || service?.title || '',
        date: data.date,
        time: data.time,
        notes: data.notes || '',
        status: 'scheduled',
        location: 'Studio 1', // Puoi rendere questo dinamico se necessario
        createdAt: new Date()
      };

      const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);

      // Schedule email reminder
      try {
        const reminderScheduled = await sendAppointmentReminder(
          { ...appointmentData, id: appointmentRef.id }, 
          adminBooking ? patient : user
        );
      
        if (!reminderScheduled) {
          console.warn('Reminder scheduling failed but appointment was created successfully');
        } else {
          console.log('Reminder scheduled successfully');
        }
      } catch (error) {
        console.error('Error scheduling reminder:', error);
        // Don't block booking if reminder fails
      }
      
      if (adminBooking) {
        navigate('/admin');
      } else {
        navigate('/profilo');
      }
    } catch (error) {
      console.error('Errore durante la prenotazione:', error);
      setError('Si è verificato un errore durante la prenotazione. Riprova più tardi.');
    }
  };

  if (!service && !specialist) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-0">
        <div className="bg-white rounded-lg shadow-sm sm:shadow px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center mb-8">
            <Calendar className="mx-auto h-12 w-12 text-rose-600" />
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900">
              {adminBooking ? `Prenota Appuntamento per ${patient.firstName} ${patient.lastName}` : 'Prenota Appuntamento'}
            </h2>
            {service && (
              <p className="mt-2 text-base sm:text-lg text-gray-600">
                Servizio: {service.title}
              </p>
            )}
            {specialist && (
              <p className="mt-2 text-base sm:text-lg text-gray-600">
                Specialista: Dr. {specialist.firstName} {specialist.lastName}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {!isDoctorAvailable ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Questo dottore non è al momento disponibile per nuove prenotazioni.
              </p>
              <button
                onClick={() => navigate('/specialisti')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
              >
                Torna alla lista degli specialisti
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-base"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Orario *
                </label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-600"></div>
                  </div>
                ) : selectedDate ? (
                  <>
                    {getAvailableTimeSlots(selectedDate).length > 0 ? (
                      <select
                        {...register('time')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-base"
                      >
                        <option value="">Seleziona un orario</option>
                        {getAvailableTimeSlots(selectedDate).map(time => {
                          const isBooked = isTimeSlotBooked(selectedDate, time);
                          return (
                          <option
                            key={time}
                            value={time}
                            disabled={isBooked}
                          >
                            {time} {isBooked ? '(Non disponibile)' : ''}
                          </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-500">Nessun orario disponibile per questa data</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Seleziona prima una data</p>
                )}
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Note (opzionale)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-base"
                placeholder="Inserisci eventuali note o richieste particolari..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 fixed bottom-0 left-0 sm:relative sm:mt-6"
            >
              Conferma Prenotazione
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}