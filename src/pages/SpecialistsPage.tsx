import React, { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import SpecialistCard from '../components/specialists/SpecialistCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from '../types';

interface Doctor extends User {
  specialization: string;
  description?: string;
  yearsOfExperience?: number;
  languages?: string[];
  isAvailable?: boolean;
}

export default function SpecialistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'doctor'));
        const querySnapshot = await getDocs(q);
        const doctorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Doctor[];
        setDoctors(doctorsData);
      } catch (err) {
        console.error('Error loading doctors:', err);
        setError('Errore nel caricamento dei dottori');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = (
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesSpecialization = !selectedSpecialization || 
      doctor.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            I Nostri Specialisti
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Un team di professionisti altamente qualificati al tuo servizio
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              placeholder="Cerca per nome o specializzazione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">Tutte le specialità</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <SpecialistCard 
              key={doctor.id} 
              specialist={{
                id: doctor.id,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                specialization: doctor.specialization || 'Non specificata',
                description: doctor.description || '',
                imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2070',
                yearsOfExperience: doctor.yearsOfExperience || 0,
                languages: doctor.languages || ['Italiano'],
                isAvailable: doctor.isAvailable ?? true
              }} 
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nessuno specialista trovato con i criteri di ricerca specificati.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}