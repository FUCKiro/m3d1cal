import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-rose-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Centro Medico Plus</span>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
              La tua salute è la nostra priorità. Offriamo servizi medici di alta qualità con un team di professionisti dedicati.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Servizi</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/servizi" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Medicina Generale
                </Link>
              </li>
              <li>
                <Link to="/servizi" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Cardiologia
                </Link>
              </li>
              <li>
                <Link to="/servizi" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Neurologia
                </Link>
              </li>
              <li>
                <Link to="/servizi" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Ortopedia
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Link Utili</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/specialisti" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  I Nostri Specialisti
                </Link>
              </li>
              <li>
                <Link to="/prenota" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Prenota Visita
                </Link>
              </li>
              <li>
                <Link to="/contatti" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Contattaci
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/termini" className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Termini e Condizioni
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Contatti</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-rose-600 mr-2" />
                Via Roma 123, 00100 Roma
              </li>
              <li className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                <Phone className="h-4 w-4 text-rose-600 mr-2" />
                +39 06 1234567
              </li>
              <li className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                <Mail className="h-4 w-4 text-rose-600 mr-2" />
                info@centromedicoplus.it
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              © 2025 Centro Medico Plus. Tutti i diritti riservati.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Progetto grafico di{' '}
                <a 
                  href="https://fabiolarocca.dev" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-rose-600 hover:text-rose-700"
                >
                  Fabio La Rocca
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}