import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function EmailVerificationPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verifica la tua email
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Abbiamo inviato un'email di verifica a:
              <br />
              <span className="font-medium text-gray-900">{user?.email}</span>
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Per completare la registrazione, clicca sul link presente nell'email.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="text-rose-600 hover:text-rose-500 font-medium"
              >
                Torna al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}