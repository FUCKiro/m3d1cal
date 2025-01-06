# Centro Medico Plus

Un'applicazione web moderna per la gestione di un centro medico, costruita con React, TypeScript e un'architettura cloud-first.

## 🌟 Caratteristiche Principali

### Per i Pazienti
- Prenotazione appuntamenti online 24/7
- Gestione profilo personale e storico visite
- Notifiche email automatiche per appuntamenti
- Chat AI per assistenza immediata
- Visualizzazione disponibilità medici in tempo reale
- Gestione documenti e referti medici

### Per i Medici
- Calendario appuntamenti personalizzato
- Gestione disponibilità e orari
- Accesso a cartelle cliniche dei pazienti
- Sistema di notifiche integrato
- Gestione note e follow-up

### Per gli Amministratori
- Dashboard completa con statistiche
- Gestione completa di medici e pazienti
- Sistema di reportistica avanzato
- Esportazione dati in CSV
- Monitoraggio performance

## 🛠️ Stack Tecnologico

### Frontend
- **React 18** con TypeScript
- **Vite** per build e development
- **TailwindCSS** per styling responsive
- **React Router** per navigazione
- **React Hook Form** + Zod per form e validazione
- **Lucide React** per icone
- **date-fns** per gestione date

### Backend e Database
- **Firebase**
  - Authentication per gestione utenti
  - Firestore per database in tempo reale
  - Cloud Functions per logica serverless
  - Hosting per deployment

### Integrazioni
- **OpenRouter** per chat AI
- **Resend** per email transazionali

## 📋 Prerequisiti

- Node.js (v16+)
- npm o yarn
- Account Firebase
- Account Resend (email)
- Account OpenRouter (chat AI)

## ⚙️ Configurazione

1. Clona il repository:
   ```bash
   git clone https://github.com/your-username/centro-medico-plus.git
   cd centro-medico-plus
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Copia il file di esempio delle variabili d'ambiente:
   ```bash
   cp .env.example .env
   ```

4. Configura le variabili d'ambiente nel file `.env`:
   - Firebase config
   - Resend API key
   - OpenRouter API key

5. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

## 🔒 Sicurezza

- Autenticazione utenti con verifica email
- Row Level Security su Firestore
- Protezione delle rotte sensibili
- Sanitizzazione input utente
- Rate limiting su API
- Crittografia dati sensibili

## 📱 Features Mobile

- Design responsive
- PWA ready
- Tema dark/light
- Notifiche push
- Offline support

## 🚀 Deployment

1. Build del progetto:
   ```bash
   npm run build
   ```

2. Deploy su Firebase:
   ```bash
   firebase deploy
   ```

## 🧪 Testing

```bash
npm run test
```

## 📖 Documentazione API

La documentazione dettagliata delle API è disponibile nella cartella `/docs`.

## 🤝 Contributing

1. Fork il repository
2. Crea un branch (`git checkout -b feature/amazing`)
3. Commit i cambiamenti (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing`)
5. Apri una Pull Request

## 📄 License

MIT

## 👥 Autori

- Fabio La Rocca - Sviluppatore principale

## 🙏 Ringraziamenti

Un ringraziamento speciale a tutti i contributori che hanno reso possibile questo progetto.