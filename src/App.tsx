import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TourProvider } from './contexts/TourContext';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/common/PageTransition';
import Header from './components/layout/Header';
import ConnectionStatus from './components/layout/ConnectionStatus';
import Footer from './components/layout/Footer';
import SpecialistsPage from './pages/SpecialistsPage';
import Hero from './components/home/Hero';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RequireAdmin from './components/auth/RequireAdmin';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import AIAssistant from './components/chat/AIAssistant';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TourProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
              <ScrollToTop />
              <Header />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageTransition><Hero /></PageTransition>} />
                  <Route path="/servizi" element={<PageTransition><ServicesPage /></PageTransition>} />
                  <Route path="/specialisti" element={<PageTransition><SpecialistsPage /></PageTransition>} />
                  <Route path="/contatti" element={<PageTransition><ContactPage /></PageTransition>} />
                  <Route path="/registrati" element={<PageTransition><RegisterPage /></PageTransition>} />
                  <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                  <Route path="/profilo" element={<PageTransition><ProfilePage /></PageTransition>} />
                  <Route path="/recupera-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
                  <Route path="/prenota" element={<PageTransition><BookingPage /></PageTransition>} />
                  <Route path="/admin" element={<PageTransition><RequireAdmin><AdminPage /></RequireAdmin></PageTransition>} />
                  <Route path="/verifica-email" element={<PageTransition><EmailVerificationPage /></PageTransition>} />
                  <Route path="/privacy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
                  <Route path="/termini" element={<PageTransition><TermsPage /></PageTransition>} />
                  <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
                </Routes>
              </AnimatePresence>
              <Footer />
              <ConnectionStatus />
              <AIAssistant />
            </div>
          </Router>
        </TourProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

export default App;
