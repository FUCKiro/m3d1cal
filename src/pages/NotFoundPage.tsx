import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-rose-500" />
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
            404
          </h1>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            Pagina non trovata
          </p>
          <p className="mt-2 text-base text-gray-500">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Potresti voler tornare alla home page o contattare il nostro supporto se ritieni che ci sia un problema.
            </p>
            
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Torna alla Home
            </Link>

            <Link
              to="/contatti"
              className="w-full flex items-center justify-center px-4 py-2 border border-rose-300 rounded-md shadow-sm text-sm font-medium text-rose-600 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}