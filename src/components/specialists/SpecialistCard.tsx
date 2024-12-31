import React from 'react';
import { Calendar, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Specialist } from '../../types';

interface SpecialistCardProps {
  specialist: Specialist;
}

export default function SpecialistCard({ specialist }: SpecialistCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateDoctor = async () => {
    try {
      const doctorRef = doc(collection(db, 'users'));
      const doctorData = {
        firstName: specialist.firstName,
        lastName: specialist.lastName,
        email: `${specialist.firstName.toLowerCase()}.${specialist.lastName.toLowerCase()}@centromedicoplus.it`,
        specialization: specialist.specialization,
        description: specialist.description,
        yearsOfExperience: specialist.yearsOfExperience,
        languages: specialist.languages || ['Italiano'],
        isAvailable: specialist.isAvailable,
        role: 'doctor',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doctorRef, doctorData);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Dottore creato con successo';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (error) {
      console.error('Error creating doctor:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = 'Errore durante la creazione del dottore';
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    }
  };

  const handleBooking = () => {
    navigate('/prenota', { state: { specialist } });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      <div className="relative">
        <img
          src={specialist.imageUrl}
          alt={`Dr. ${specialist.firstName} ${specialist.lastName}`}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        {specialist.isAvailable && (
          <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Disponibile
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Dr. {specialist.firstName} {specialist.lastName}
      </h3>
      
      <p className="text-rose-600 font-medium mt-1">
        {specialist.specialization}
      </p>
      
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        <p>{specialist.description}</p>
      </div>
      
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        {specialist.languages && (
          <p>
            <span className="font-medium">Lingue:</span> {specialist.languages.join(', ')}
          </p>
        )}
        <p>
          <span className="font-medium">Esperienza:</span> {specialist.yearsOfExperience} anni
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-col space-y-2">
          <button
            className="w-full bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 flex items-center justify-center"
            onClick={handleBooking}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Prenota Visita
          </button>
          
          {user?.role === 'admin' && (
            <button
              onClick={handleCreateDoctor}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Crea Account Dottore
            </button>
          )}
        </div>
      </div>
    </div>
  );
}