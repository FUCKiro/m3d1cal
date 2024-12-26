import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SpecialistCard from '../components/specialists/SpecialistCard';
import { specialists } from '../data/specialists';
import type { Specialist } from '../types';

const specializations = [...new Set(specialists.map(s => s.specialization))];

export default function SpecialistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');

  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = (
      specialist.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesSpecialization = !selectedSpecialization || 
      specialist.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpecialists.map((specialist) => (
            <SpecialistCard key={specialist.id} specialist={specialist} />
          ))}
        </div>

        {filteredSpecialists.length === 0 && (
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