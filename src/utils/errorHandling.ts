export function handleFirebaseError(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case 'auth/email-already-in-use':
        return 'Questa email è già registrata';
      case 'auth/invalid-email':
        return 'Email non valida';
      case 'auth/operation-not-allowed':
        return 'Operazione non consentita';
      case 'auth/weak-password':
        return 'La password deve essere più forte';
      case 'auth/user-disabled':
        return 'Account disabilitato';
      case 'auth/user-not-found':
        return 'Utente non trovato';
      case 'auth/wrong-password':
        return 'Password non corretta';
      case 'auth/invalid-credential':
        return 'Credenziali non valide';
      default:
        return error.message;
    }
  }
  return 'Si è verificato un errore';
}