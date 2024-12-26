import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const resetSchema = z.object({
  email: z.string().email('Email non valida'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      await resetPassword(data.email);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Recupera la tua password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'success' ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Abbiamo inviato le istruzioni per il recupero della password alla tua email
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {status === 'error' && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        Si è verificato un errore. Riprova più tardi.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    {...register('email')}
                    type="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Invia istruzioni
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-rose-600 hover:text-rose-500"
            >
              Torna al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}