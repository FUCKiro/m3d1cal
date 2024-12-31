/*
  # Doctor Schedules Schema

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `specialization` (text)
      - `description` (text)
      - `years_of_experience` (integer)
      - `languages` (text array)
      - `is_available` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `doctor_schedules`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `day_of_week` (text)
      - `time_slots` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for admins and doctors
*/

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  specialization text NOT NULL,
  description text,
  years_of_experience integer DEFAULT 0,
  languages text[] DEFAULT ARRAY[]::text[],
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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
CREATE POLICY "Public can view available doctors" 
  ON doctors 
  FOR SELECT 
  USING (is_available = true);

CREATE POLICY "Doctors can view their own data" 
  ON doctors 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage doctors" 
  ON doctors 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policies for doctor_schedules table
CREATE POLICY "Public can view schedules" 
  ON doctor_schedules 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = doctor_schedules.doctor_id 
      AND doctors.is_available = true
    )
  );

CREATE POLICY "Doctors can manage their schedules" 
  ON doctor_schedules 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = doctor_schedules.doctor_id 
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage schedules" 
  ON doctor_schedules 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

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