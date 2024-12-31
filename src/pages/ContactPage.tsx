import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Come posso prenotare una visita?",
    answer: "Puoi prenotare una visita direttamente online attraverso il nostro sistema di prenotazione, oppure chiamando il nostro numero di telefono durante gli orari di apertura."
  },
  {
    question: "Quali documenti devo portare alla visita?",
    answer: "È necessario portare un documento d'identità valido, la tessera sanitaria e eventuali esami o documentazione medica precedente pertinente alla visita."
  },
  {
    question: "Come posso disdire o spostare un appuntamento?",
    answer: "Puoi gestire i tuoi appuntamenti accedendo alla tua area personale sul sito, oppure contattandoci telefonicamente con almeno 24 ore di anticipo."
  },
  {
    question: "Accettate pagamenti con carta?",
    answer: "Sì, accettiamo pagamenti con tutte le principali carte di credito e debito, oltre a contanti e bonifici bancari."
  },
  {
    question: "Come posso richiedere una copia della mia cartella clinica?",
    answer: "Puoi richiedere la tua cartella clinica direttamente dalla tua area personale sul sito o facendone richiesta presso la nostra segreteria."
  }
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <HelpCircle className="mx-auto h-12 w-12 text-rose-600" />
        <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Domande Frequenti
        </h3>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <button
              className="w-full px-6 py-4 flex justify-between items-center text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-500 dark:text-gray-300">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Contattaci
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Siamo qui per aiutarti. Contattaci per qualsiasi informazione.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Invia un Messaggio</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Messaggio
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Informazioni di Contatto</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-rose-600 mt-1" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Indirizzo</h4>
                  <p className="text-gray-500 dark:text-gray-300">Via Roma 123, 00100 Roma (RM)</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-rose-600 mt-1" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Telefono</h4>
                  <p className="text-gray-500 dark:text-gray-300">+39 06 1234567</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-rose-600 mt-1" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Email</h4>
                  <p className="text-gray-500 dark:text-gray-300">info@centromedicoplus.it</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-rose-600 mt-1" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Orari</h4>
                  <p className="text-gray-500 dark:text-gray-300">Lun - Ven: 8:00 - 20:00</p>
                  <p className="text-gray-500 dark:text-gray-300">Sab: 8:00 - 14:00</p>
                  <p className="text-gray-500 dark:text-gray-300">Dom: Chiuso</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FaqSection />
      </div>
    </div>
  );
}