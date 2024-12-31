/*
  # Gestione Dottori e Orari

  1. Nuove Tabelle
    - `doctors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `specialization` (text)
      - `description` (text)
      - `years_of_experience` (integer)
      - `languages` (text[])
      - `is_available` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `doctor_schedules`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `day_of_week` (text)
      - `time_slots` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS su entrambe le tabelle
    - Policies per permettere agli admin di gestire i dottori
    - Policies per permettere ai dottori di vedere/modificare i propri orari
*/

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  specialization text NOT NULL,
  description text,
  years_of_experience integer DEFAULT 0,
  languages text[] DEFAULT ARRAY[]::text[],
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create doctor_schedules table
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week text NOT NULL,
  time_slots text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, day_of_week)
);

-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;

-- Policies for doctors table
CREATE POLICY "Admins can manage doctors"
  ON doctors
  FOR ALL
  TO authenticated
  USING (auth.uid IN (
    SELECT id FROM users WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

CREATE POLICY "Doctors can view their own data"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid);

-- Policies for doctor_schedules table
CREATE POLICY "Admins can manage schedules"
  ON doctor_schedules
  FOR ALL
  TO authenticated
  USING (auth.uid IN (
    SELECT id FROM users WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

CREATE POLICY "Doctors can manage their own schedules"
  ON doctor_schedules
  FOR ALL
  TO authenticated
  USING (doctor_id IN (
    SELECT id FROM doctors WHERE user_id = auth.uid
  ))
  WITH CHECK (doctor_id IN (
    SELECT id FROM doctors WHERE user_id = auth.uid
  ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_schedules_updated_at
  BEFORE UPDATE ON doctor_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();