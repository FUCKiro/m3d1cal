export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  specialization?: string;
  medicalHistory?: string[];
  appointments?: Appointment[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  location: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  specialization: string;
  notes?: string;
}

interface PatientData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  fiscalCode: string;
}

export interface AdminAppointment extends Appointment {
  createdAt: string;
  patient: PatientData;
}

export interface Specialist {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  description: string;
  imageUrl: string;
  yearsOfExperience: number;
  languages?: string[];
  isAvailable: boolean;
}

export interface Service {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  longDescription: string;
  includes: string[];
  duration: string;
  price: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}