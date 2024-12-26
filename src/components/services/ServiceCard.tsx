import React from 'react';
import type { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const { icon: Icon, title, description, price } = service;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(service)}
    >
      <div className="inline-flex items-center justify-center rounded-md bg-rose-50 dark:bg-rose-900/20 p-3">
        <Icon className="h-6 w-6 text-rose-600" />
      </div>
      <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-gray-500 dark:text-gray-300">{description}</p>
      <p className="mt-4 text-rose-600 font-semibold">{price}</p>
    </div>
  );
}