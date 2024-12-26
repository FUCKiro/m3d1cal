import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function promoteToAdmin(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('Utente non trovato');
    }

    await updateDoc(userRef, {
      role: 'admin'
    });

    console.log(`Utente ${userId} promosso ad admin con successo`);
  } catch (error) {
    console.error('Errore durante la promozione ad admin:', error);
    throw error;
  }
}