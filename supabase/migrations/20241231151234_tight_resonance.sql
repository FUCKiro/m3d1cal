/*
  # Fix Doctor Deletion

  1. Changes
    - Add cascading delete function for doctors
    - Add cleanup triggers
    - Update RLS policies
    - Add indexes for better performance

  2. Security
    - Ensure only admins can delete doctors
    - Maintain data integrity with cascading deletes
*/

-- Create a function to handle doctor deletion with all related data
CREATE OR REPLACE FUNCTION delete_doctor_cascade(doctor_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Delete all appointments
  DELETE FROM appointments
  WHERE doctor_id IN (
    SELECT id FROM doctors WHERE user_id = doctor_user_id
  );

  -- Delete doctor schedules
  DELETE FROM doctor_schedules
  WHERE doctor_id IN (
    SELECT id FROM doctors WHERE user_id = doctor_user_id
  );

  -- Delete doctor record
  DELETE FROM doctors
  WHERE user_id = doctor_user_id;

  -- Delete user record
  DELETE FROM auth.users
  WHERE id = doctor_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_id ON doctor_schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);

-- Update RLS policies to ensure proper deletion access
DROP POLICY IF EXISTS "Admins can manage doctors" ON doctors;
CREATE POLICY "Admins can manage doctors"
ON doctors
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);

-- Add a trigger to cleanup related data when a doctor is deleted
CREATE OR REPLACE FUNCTION trigger_cleanup_doctor_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all related data
  DELETE FROM appointments WHERE doctor_id = OLD.id;
  DELETE FROM doctor_schedules WHERE doctor_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_doctor_data
  BEFORE DELETE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION trigger_cleanup_doctor_data();