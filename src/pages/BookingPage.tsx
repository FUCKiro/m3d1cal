import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, AlertCircle } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { scheduleReminder } from '../utils/sendReminder';

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
  const [bookedSlots, setBookedSlots] = useState<BookedTimeSlot[]>([]);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const { service, specialist } = location.state || {};

  useEffect(() => {
    const loadBookedSlots = async () => {
      if (specialist?.id) {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(
          appointmentsRef,
          where('doctorId', '==', specialist.id),
          where('status', '==', 'scheduled')
        );

        const querySnapshot = await getDocs(q);
        const slots = querySnapshot.docs.map(doc => ({
          date: doc.data().date,
          time: doc.data().time
        }));
        setBookedSlots(slots);
      }
    };

    loadBookedSlots();
  }, [specialist?.id]);

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

  const { register, handleSubmit, formState: { errors }, watch } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
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
        patientId: user.uid,
        doctorId: specialist?.id || '',
        doctorName: specialist ? `${specialist.firstName} ${specialist.lastName}` : '',
        specialization: specialist?.specialization || service?.title || '',
        date: data.date,
        time: data.time,
        notes: data.notes || '',
        status: 'scheduled',
        location: 'Studio 1', // Puoi rendere questo dinamico se necessario
        createdAt: new Date().toISOString()
      };

      const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);
      
      // Schedule reminder
      await scheduleReminder(appointmentRef.id);
      
      navigate('/profilo');
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
              Prenota Appuntamento
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data
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
                  Orario
                </label>
                <select
                  {...register('time')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-base"
                >
                  <option value="">Seleziona un orario</option>
                  {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                    <option
                      key={time}
                      value={time}
                      disabled={isTimeSlotBooked(watch('date'), time)}
                    >
                      {time} {isTimeSlotBooked(watch('date'), time) ? '(Non disponibile)' : ''}
                    </option>
                  ))}
                </select>
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
        </div>
      </div>
    </div>
  );
}