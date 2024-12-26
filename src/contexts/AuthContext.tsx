import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { User } from '../types';

interface AuthContextType {
  user: (FirebaseUser & Partial<User>) | null;
  loading: boolean;
  register: (email: string, password: string, userData: UserData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  phoneNumber: string;
  birthDate: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(FirebaseUser & Partial<User>) | null>(null);
  const [loading, setLoading] = useState(true);

  async function register(email: string, password: string, userData: UserData) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Invia email di verifica
      await sendEmailVerification(user);

      // Salva i dati utente in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDataToSave = {
        ...userData,
        role: 'patient',
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, userDataToSave);

      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante la registrazione';
      console.error(errorMessage);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (!result.user.emailVerified) {
        throw new Error('Per favore verifica la tua email prima di accedere');
      }

      // Carica i dati utente da Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        throw new Error('Dati utente non trovati');
      }

      const userData = userDoc.data();
      // Assicurati che il ruolo sia impostato correttamente
      setUser({ ...result.user, ...userData, role: userData.role || 'patient' });
      return result.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il login';
      console.error(errorMessage);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    return firebaseSignOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Carica i dati utente da Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Assicurati che il ruolo sia incluso nell'oggetto utente
            setUser({ 
              ...firebaseUser, 
              ...userData,
              role: userData.role || 'patient' 
            });
          } else {
            setUser({ ...firebaseUser, role: 'patient' });
          }
        } catch (error) {
          console.error('Errore nel caricamento dei dati utente:', error);
          setUser({ ...firebaseUser, role: 'patient' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}