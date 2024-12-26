import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="mx-auto h-12 w-12 text-rose-600" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Termini e Condizioni</h1>
          <p className="mt-2 text-lg text-gray-500">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
        </div>

        <div className="prose prose-rose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Accettazione dei Termini</h2>
            <p className="text-gray-600">
              Utilizzando i servizi di Centro Medico Plus, accetti i seguenti termini e condizioni. 
              Ti preghiamo di leggerli attentamente prima di utilizzare i nostri servizi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Servizi Offerti</h2>
            <p className="text-gray-600 mb-4">
              Centro Medico Plus fornisce:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Servizi medici specialistici</li>
              <li>Prenotazione online di visite mediche</li>
              <li>Gestione della cartella clinica digitale</li>
              <li>Comunicazioni relative alla salute</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilità dell'Utente</h2>
            <p className="text-gray-600 mb-4">
              L'utente si impegna a:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Fornire informazioni accurate e veritiere</li>
              <li>Mantenere riservate le proprie credenziali di accesso</li>
              <li>Rispettare gli orari degli appuntamenti</li>
              <li>Comunicare tempestivamente eventuali cancellazioni</li>
              <li>Non utilizzare i servizi per scopi illeciti</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prenotazioni e Cancellazioni</h2>
            <p className="text-gray-600 mb-4">
              Politiche di prenotazione:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Le prenotazioni devono essere effettuate con almeno 24 ore di anticipo</li>
              <li>Le cancellazioni devono essere comunicate con almeno 24 ore di anticipo</li>
              <li>In caso di mancata presentazione, potrebbe essere addebitata una penale</li>
              <li>Il centro si riserva il diritto di modificare gli appuntamenti per cause di forza maggiore</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pagamenti</h2>
            <p className="text-gray-600 mb-4">
              Condizioni di pagamento:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>I pagamenti devono essere effettuati al momento della prestazione</li>
              <li>Accettiamo contanti, carte di credito e bancomat</li>
              <li>Le tariffe possono essere soggette a modifiche</li>
              <li>Eventuali convenzioni devono essere comunicate prima della prestazione</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy e Riservatezza</h2>
            <p className="text-gray-600">
              Il trattamento dei dati personali è regolato dalla nostra Informativa sulla Privacy, 
              conforme al GDPR e alle normative vigenti sulla protezione dei dati personali.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifiche ai Termini</h2>
            <p className="text-gray-600">
              Centro Medico Plus si riserva il diritto di modificare questi termini in qualsiasi momento. 
              Le modifiche saranno effettive dalla data di pubblicazione sul sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contatti</h2>
            <p className="text-gray-600">
              Per qualsiasi domanda sui termini di servizio, contattaci:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mt-2">
              <p className="text-gray-600">Email: info@centromedicoplus.it</p>
              <p className="text-gray-600">Tel: +39 06 1234567</p>
              <p className="text-gray-600">Indirizzo: Via Roma 123, 00100 Roma</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}