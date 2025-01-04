# Centro Medico Plus

Un'applicazione web moderna per la gestione di un centro medico, costruita con React, TypeScript e un'architettura cloud-first.

## 🌟 Caratteristiche Principali

- Autenticazione utenti con verifica email
- Prenotazione appuntamenti in tempo reale
- Gestione profilo utente e cartella clinica
- Area amministrativa per gestione dottori e appuntamenti
- Sistema di notifiche email automatizzate
- Interfaccia responsive e tema dark/light
- Supporto multilingua (IT)

## 🛠️ Stack Tecnologico

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipizzazione statica
- **Vite** - Build tool e dev server
- **React Router** - Routing e navigazione
- **React Hook Form** - Gestione form
- **Zod** - Validazione dati
- **Tailwind CSS** - Styling
- **Lucide React** - Icone
- **date-fns** - Gestione date

### Backend e Database
- **Firebase**
  - Authentication - Gestione utenti
  - Firestore - Database NoSQL
  - Cloud Functions - Logica serverless
  - Hosting - Deployment

### Email e Notifiche
- **Resend** - Servizio di invio email

### CI/CD e Tooling
- **ESLint** - Linting
- **TypeScript-ESLint** - Linting TypeScript
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS compatibility

## 📋 Prerequisiti

- Node.js (versione 16 o superiore)
- npm o yarn
- Account Firebase
- Account Resend (per email)

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

3. Configura le variabili d'ambiente:
   ```bash
   cp .env.example .env
   ```

   Richieste le seguenti variabili:
   - `VITE_FIREBASE_CONFIG` - Configurazione Firebase
   - `VITE_RESEND_API_KEY` - API key Resend

4. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

## 🔒 Sicurezza

- Autenticazione utenti con email verification
- Regole di sicurezza Firestore
- Protezione delle rotte sensibili
- Sanitizzazione input utente
- Rate limiting su API
- Crittografia dati sensibili

## 📧 Sistema Email

Il sistema utilizza Resend come provider di email:
- Notifiche automatiche per appuntamenti
- Email di verifica account
- Recupero password
- Template HTML personalizzati

## 🗄️ Database

### Firestore
- Dati real-time
- Cache offline
- Sincronizzazione automatica
- Backup automatici
- Indici ottimizzati

## 📝 Licenza

MIT

## 👥 Autori

- Fabio La Rocca - Sviluppatore principale