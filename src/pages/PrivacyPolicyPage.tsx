import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="mx-auto h-12 w-12 text-rose-600" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Informativa sulla Privacy</h1>
          <p className="mt-2 text-lg text-gray-500">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
        </div>

        <div className="prose prose-rose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Raccolta dei Dati</h2>
            <p className="text-gray-600 mb-4">
              Centro Medico Plus raccoglie i seguenti tipi di informazioni personali:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Dati anagrafici (nome, cognome, data di nascita)</li>
              <li>Informazioni di contatto (email, numero di telefono, indirizzo)</li>
              <li>Dati sanitari (storia clinica, appuntamenti, prescrizioni)</li>
              <li>Codice fiscale e documenti d'identità</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Utilizzo dei Dati</h2>
            <p className="text-gray-600 mb-4">
              I dati raccolti vengono utilizzati per:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Fornire servizi medici e gestire gli appuntamenti</li>
              <li>Comunicare informazioni importanti sulla salute</li>
              <li>Gestire le pratiche amministrative</li>
              <li>Migliorare la qualità dei nostri servizi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Protezione dei Dati</h2>
            <p className="text-gray-600">
              Adottiamo rigorose misure di sicurezza per proteggere i tuoi dati personali, inclusi:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Crittografia dei dati sensibili</li>
              <li>Controlli degli accessi</li>
              <li>Formazione del personale sulla privacy</li>
              <li>Backup regolari e sicuri</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. I Tuoi Diritti</h2>
            <p className="text-gray-600">
              Hai il diritto di:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Accedere ai tuoi dati personali</li>
              <li>Richiedere la rettifica dei dati inesatti</li>
              <li>Richiedere la cancellazione dei dati</li>
              <li>Opporti al trattamento dei dati</li>
              <li>Richiedere la portabilità dei dati</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contatti</h2>
            <p className="text-gray-600">
              Per qualsiasi domanda sulla privacy dei tuoi dati, contatta il nostro Responsabile della Protezione dei Dati:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mt-2">
              <p className="text-gray-600">Email: privacy@centromedicoplus.it</p>
              <p className="text-gray-600">Tel: +39 06 1234567</p>
              <p className="text-gray-600">Indirizzo: Via Roma 123, 00100 Roma</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}