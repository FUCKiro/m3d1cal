import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Specialist } from '../../types';
import DoctorReviews from './DoctorReviews';

interface SpecialistCardProps {
  specialist: Specialist;
}

export default function SpecialistCard({ specialist }: SpecialistCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showReviews, setShowReviews] = useState(false);
  const { user } = useAuth();
  const { adminBooking, patient } = location.state || {};

  const handleBooking = () => {
    if (!adminBooking && !user) {
      navigate('/login', { 
        state: { 
          from: location.pathname,
          specialist 
        } 
      });
      return;
    }

    navigate('/prenota', { 
      state: { 
        specialist,
        adminBooking,
        patient
      } 
    });
  };

  return specialist ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
    >
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
        </div>
        
        <button
          onClick={() => setShowReviews(!showReviews)}
          className="mt-2 w-full text-gray-600 dark:text-gray-300 text-sm hover:text-gray-900 dark:hover:text-white"
        >
          {showReviews ? 'Nascondi recensioni' : 'Mostra recensioni'}
        </button>
        {showReviews && <DoctorReviews doctorId={specialist.id} doctorName={`${specialist.firstName} ${specialist.lastName}`} />}
      </div>
    </motion.div>
  ) : null;
}