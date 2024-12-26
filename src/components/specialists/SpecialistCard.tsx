import React from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Specialist } from '../../types';

interface SpecialistCardProps {
  specialist: Specialist;
}

export default function SpecialistCard({ specialist }: SpecialistCardProps) {
  const navigate = useNavigate();

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
        <button
          className="w-full bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 flex items-center justify-center"
          onClick={handleBooking}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Prenota Visita
        </button>
      </div>
    </div>
  );
}