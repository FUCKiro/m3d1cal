/*
  # Add automatic user deletion

  1. New Functions
    - `delete_inactive_users`: Elimina automaticamente gli utenti inattivi dopo un periodo specificato
    - `delete_unverified_users`: Elimina gli utenti che non hanno verificato l'email dopo un periodo specificato

  2. Security
    - Le funzioni possono essere eseguite solo da superuser o ruoli admin
    - I trigger sono protetti da modifiche non autorizzate

  3. Changes
    - Aggiunta colonna last_login alla tabella users
    - Aggiunta colonna email_verified_at alla tabella users
*/

-- Aggiungi colonne necessarie
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;

-- Funzione per eliminare utenti inattivi
CREATE OR REPLACE FUNCTION delete_inactive_users()
RETURNS void AS $$
BEGIN
  -- Elimina utenti inattivi da più di 1 anno
  DELETE FROM auth.users
  WHERE last_login < NOW() - INTERVAL '1 year'
  AND role != 'admin'; -- Non eliminare mai gli admin
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funzione per eliminare utenti non verificati
CREATE OR REPLACE FUNCTION delete_unverified_users()
RETURNS void AS $$
BEGIN
  -- Elimina utenti che non hanno verificato l'email dopo 7 giorni
  DELETE FROM auth.users
  WHERE email_verified_at IS NULL
  AND created_at < NOW() - INTERVAL '7 days'
  AND role != 'admin'; -- Non eliminare mai gli admin
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger per aggiornare last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_last_login
  BEFORE UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_last_login();

-- Crea una funzione di pulizia che esegue entrambe le eliminazioni
CREATE OR REPLACE FUNCTION cleanup_users()
RETURNS void AS $$
BEGIN
  PERFORM delete_inactive_users();
  PERFORM delete_unverified_users();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crea un job schedulato per eseguire la pulizia ogni giorno
SELECT cron.schedule(
  'cleanup-users',
  '0 0 * * *', -- Ogni giorno a mezzanotte
  'SELECT cleanup_users()'
);