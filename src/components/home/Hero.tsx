import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, Phone, Star, Award, Shield, Activity } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-rose-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">La Tua Salute è la</span>
                <span className="block text-rose-600 animate-pulse">Nostra Priorità</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Accedi a cure mediche di alta qualità con il nostro team di specialisti. Prenota visite online, gestisci la tua cartella clinica e ricevi cure personalizzate, tutto in un unico posto.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/prenota" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10">
                    Prenota Ora
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/contatti" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-rose-700 bg-rose-100 hover:bg-rose-200 transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10">
                    Contattaci
                  </Link>
                </div>
              </div>
              <div className="mt-8 flex justify-center lg:justify-start space-x-6">
                <Stat number="15+" text="Anni di Esperienza" />
                <Stat number="50+" text="Specialisti" />
                <Stat number="10k+" text="Pazienti Soddisfatti" />
              </div>
            </div>
          </main>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6 lg:px-8">
            <FeatureCard
              icon={<Calendar className="h-6 w-6 text-rose-600" />}
              title="Prenotazione Facile"
              description="Prenota visite online 24/7"
            />
            <FeatureCard
              icon={<Award className="h-6 w-6 text-rose-600" />}
              title="Medici Esperti"
              description="Specialisti qualificati in diverse aree"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-rose-600" />}
              title="Orari Flessibili"
              description="Orari estesi, inclusi i weekend"
            />
            <FeatureCard
              icon={<Activity className="h-6 w-6 text-rose-600" />}
              title="Supporto 24/7"
              description="Sempre presenti quando hai bisogno"
            />
          </div>
          
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Perché Scegliere Noi</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
              <WhyUsCard
                icon={<Star className="h-8 w-8 text-yellow-400" />}
                title="Eccellenza Medica"
                description="Team di professionisti altamente qualificati e tecnologie all'avanguardia"
              />
              <WhyUsCard
                icon={<Users className="h-8 w-8 text-blue-500" />}
                title="Approccio Personalizzato"
                description="Cure su misura per le tue esigenze specifiche"
              />
              <WhyUsCard
                icon={<Clock className="h-8 w-8 text-green-500" />}
                title="Tempestività"
                description="Tempi di attesa ridotti e assistenza rapida"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2070"
          alt="Medical team"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
      <div className="inline-flex items-center justify-center rounded-md bg-rose-50 p-3">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">{description}</p>
    </div>
  );
}

function WhyUsCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Stat({ number, text }: { number: string; text: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-rose-600">{number}</p>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}