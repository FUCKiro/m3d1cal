import { Stethoscope, Heart, Brain, ActivitySquare, Eye, Scissors } from 'lucide-react';
import type { Service } from '../types';

export const services: Service[] = [
  {
    id: '1',
    icon: Stethoscope,
    title: 'Medicina Generale',
    description: 'Visite mediche generali e consulenze sanitarie complete',
    longDescription: 'Il servizio di Medicina Generale offre una valutazione completa dello stato di salute del paziente, con particolare attenzione alla prevenzione e al mantenimento del benessere generale. Il nostro approccio è personalizzato e tiene conto della storia clinica individuale.',
    includes: [
      'Visita medica completa',
      'Valutazione dei parametri vitali',
      'Prescrizione di esami diagnostici',
      'Consulenza su stili di vita sani',
      'Piano di prevenzione personalizzato'
    ],
    duration: '30-45 minuti',
    price: 'da €80'
  },
  {
    id: '2',
    icon: Heart,
    title: 'Cardiologia',
    description: 'Controlli cardiaci, ECG e monitoraggio pressione',
    longDescription: 'Il servizio di Cardiologia fornisce una valutazione approfondita della salute cardiovascolare, utilizzando tecnologie all\'avanguardia per la diagnosi e il monitoraggio delle patologie cardiache. I nostri specialisti sono esperti nel trattamento di tutte le problematiche cardiovascolari.',
    includes: [
      'Elettrocardiogramma (ECG)',
      'Ecocardiogramma',
      'Holter pressorio e cardiaco',
      'Test da sforzo',
      'Consulenza specialistica'
    ],
    duration: '45-60 minuti',
    price: 'da €120'
  },
  {
    id: '3',
    icon: Brain,
    title: 'Neurologia',
    description: 'Diagnosi e trattamento di disturbi neurologici',
    longDescription: 'Il servizio di Neurologia si occupa della diagnosi e del trattamento di tutti i disturbi del sistema nervoso. Utilizziamo approcci innovativi e tecnologie moderne per garantire la migliore cura possibile per ogni paziente.',
    includes: [
      'Valutazione neurologica completa',
      'Elettroencefalogramma (EEG)',
      'Test cognitivi',
      'Valutazione dei disturbi del sonno',
      'Piano terapeutico personalizzato'
    ],
    duration: '60 minuti',
    price: 'da €150'
  },
  {
    id: '4',
    icon: ActivitySquare,
    title: 'Ortopedia',
    description: 'Trattamento di problemi muscolo-scheletrici',
    longDescription: 'Il servizio di Ortopedia offre trattamenti specializzati per tutte le problematiche dell\'apparato muscolo-scheletrico. I nostri specialisti utilizzano le più moderne tecniche di diagnosi e terapia per garantire il recupero ottimale della funzionalità.',
    includes: [
      'Visita ortopedica',
      'Valutazione posturale',
      'Infiltrazioni',
      'Prescrizione di terapie riabilitative',
      'Consulenza chirurgica'
    ],
    duration: '45 minuti',
    price: 'da €110'
  },
  {
    id: '5',
    icon: Eye,
    title: 'Oculistica',
    description: 'Esami della vista e trattamenti oculistici',
    longDescription: 'Il servizio di Oculistica fornisce una gamma completa di prestazioni per la diagnosi e il trattamento di tutte le patologie oculari. Utilizziamo strumentazioni di ultima generazione per garantire la massima precisione nella diagnosi.',
    includes: [
      'Esame della vista completo',
      'Tonometria',
      'Fundoscopia',
      'Test del campo visivo',
      'Prescrizione lenti correttive'
    ],
    duration: '30-45 minuti',
    price: 'da €90'
  },
  {
    id: '6',
    icon: Scissors,
    title: 'Odontoiatria',
    description: 'Cure dentali complete e ortodonzia',
    longDescription: 'Il servizio di Odontoiatria offre trattamenti completi per la salute dentale, dall\'igiene alla chirurgia orale. Il nostro team utilizza tecnologie all\'avanguardia per garantire cure dentali di alta qualità in un ambiente confortevole.',
    includes: [
      'Visita odontoiatrica',
      'Igiene dentale professionale',
      'Trattamenti conservativi',
      'Implantologia',
      'Ortodonzia'
    ],
    duration: '45-60 minuti',
    price: 'da €100'
  }
];