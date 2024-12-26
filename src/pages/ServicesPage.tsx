import React, { useState } from 'react';
import ServiceCard from '../components/services/ServiceCard';
import ServiceModal from '../components/services/ServiceModal';
import { services } from '../data/services';
import type { Service } from '../types';


export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            I Nostri Servizi
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Offriamo una vasta gamma di servizi medici specialistici per prenderci cura della tua salute
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={handleServiceSelect}
            />
          ))}
        </div>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            isOpen={!!selectedService}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}