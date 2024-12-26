import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contattaci
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Siamo qui per aiutarti. Contattaci per qualsiasi informazione.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Invia un Messaggio</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Messaggio
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rose-600 text-white px-4 py-2 rounded-md font-medium hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Invia Messaggio
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Informazioni di Contatto</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-rose-600 mt-1" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Indirizzo</h4>
                  <p className="text-gray-500">Via Roma 123, 00100 Roma (RM)</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-rose-600 mt-1" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Telefono</h4>
                  <p className="text-gray-500">+39 06 1234567</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-rose-600 mt-1" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Email</h4>
                  <p className="text-gray-500">info@centromedicoplus.it</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-rose-600 mt-1" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Orari</h4>
                  <p className="text-gray-500">Lun - Ven: 8:00 - 20:00</p>
                  <p className="text-gray-500">Sab: 8:00 - 14:00</p>
                  <p className="text-gray-500">Dom: Chiuso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}