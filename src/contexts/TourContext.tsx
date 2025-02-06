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
    content: 'Benvenuto al Centro Medico Plus! Ti guideremo attraverso le principali funzionalità del nostro portale.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="nav-specialists"]',
    content: 'Qui puoi visualizzare e prenotare visite con i nostri specialisti.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="nav-booking"]',
    content: 'Usa questo pulsante per prenotare rapidamente una visita.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="nav-profile"]',
    content: 'Accedi al tuo profilo per gestire appuntamenti e dati personali.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="ai-assistant"]',
    content: 'Il nostro assistente virtuale è qui per aiutarti 24/7.',
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
    
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
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
        scrollToFirstStep
        continuous
        showProgress
        showSkipButton
        spotlightClicks
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#e11d48',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            zIndex: 1000,
          },
          spotlight: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          tooltip: {
            padding: '20px',
            borderRadius: '8px',
          },
        }}
        locale={{
          back: 'Indietro',
          close: 'Chiudi',
          last: 'Finito',
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