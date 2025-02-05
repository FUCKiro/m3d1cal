import React, { createContext, useContext, useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface TourContextType {
  startTour: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextType | null>(null);

const steps: Step[] = [
  {
    target: 'body',
    content: 'Benvenuto al Centro Medico Plus! Ti guideremo attraverso le principali funzionalità.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.specialists-section',
    content: 'Qui puoi trovare tutti i nostri specialisti e prenotare una visita.',
    placement: 'bottom',
  },
  {
    target: '.booking-button',
    content: 'Clicca qui per prenotare una visita con uno specialista.',
    placement: 'bottom',
  },
  {
    target: '.profile-section',
    content: 'Nel tuo profilo puoi gestire i tuoi appuntamenti e dati personali.',
    placement: 'bottom',
  },
  {
    target: '.ai-assistant',
    content: 'Il nostro assistente virtuale è sempre disponibile per aiutarti.',
    placement: 'left',
  },
];

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.setItem('hasSeenTour', 'true');
    } else {
      setStepIndex(index);
    }
  };

  const startTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  const endTour = () => {
    setRun(false);
  };

  return (
    <TourContext.Provider value={{ startTour, endTour }}>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#e11d48',
            textColor: '#374151',
          },
        }}
        locale={{
          back: 'Indietro',
          close: 'Chiudi',
          last: 'Fine',
          next: 'Avanti',
          skip: 'Salta',
        }}
      />
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}