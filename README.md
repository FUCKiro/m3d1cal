# Centro Medico Plus

Un'applicazione web moderna per la gestione di un centro medico, costruita con React, TypeScript e Firebase.

## 🚀 Caratteristiche

- Autenticazione utenti
- Prenotazione appuntamenti
- Gestione profilo utente
- Lista specialisti
- Catalogo servizi
- Interfaccia responsive

## 🛠️ Tecnologie

- React
- TypeScript
- Firebase
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- Lucide React

## 📋 Prerequisiti

- Node.js (versione 16 o superiore)
- npm o yarn
- Un account Firebase

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

3. Crea un file `.env` nella root del progetto basandoti su `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configura le variabili d'ambiente nel file `.env` con le tue credenziali Firebase

5. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

## 🔒 Sicurezza

- Le credenziali Firebase sono protette attraverso variabili d'ambiente
- Implementate regole di sicurezza Firestore
- Autenticazione utenti con email verification
- Protezione delle rotte sensibili

## 📝 License

MIT