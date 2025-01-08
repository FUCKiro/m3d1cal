# Centro Medico Plus

A modern medical center management system built with React, TypeScript, and Firebase.

## 🚀 Features

### For Patients
- 24/7 online appointment booking
- Personal profile and visit history management 
- Automated email appointment reminders
- AI-powered chat assistance
- Real-time doctor availability
- Medical document management

### For Doctors
- Customized appointment calendar
- Availability and schedule management
- Patient medical records access
- Integrated notification system
- Notes and follow-up management

### For Administrators
- Complete dashboard with statistics
- Full doctor and patient management
- Advanced reporting system
- CSV data export
- Performance monitoring

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build and development
- TailwindCSS for responsive styling
- React Router for navigation
- React Hook Form + Zod for form validation
- Lucide React for icons
- date-fns for date handling

### Backend & Database
- Firebase
  - Authentication for user management
  - Firestore for real-time database
  - Cloud Functions for serverless logic
  - Hosting for deployment

### Integrations
- OpenRouter for AI chat
- EmailJS for transactional emails

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase account
- EmailJS account
- OpenRouter API key

## ⚙️ Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/centro-medico-plus.git
   cd centro-medico-plus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id

   # EmailJS Configuration
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

   # AI Chat
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## 🔒 Security Features

- Email verification for users
- Row Level Security in Firestore
- Protected routes
- Input sanitization
- API rate limiting
- Sensitive data encryption

## 📱 Mobile Features

- Responsive design
- PWA ready
- Dark/light theme
- Push notifications
- Offline support

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## 🧪 Testing

```bash
npm run test
```

## 📖 API Documentation

Detailed API documentation is available in the `/docs` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT

## 👥 Authors

- Fabio La Rocca - Lead Developer

## 🙏 Acknowledgments

Special thanks to all contributors who helped make this project possible.

## 📞 Support

For support, email support@centromedicoplus.it or create an issue in the repository.