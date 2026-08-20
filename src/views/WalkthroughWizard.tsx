import React, { useState } from 'react';
import { WalkthroughData } from '../utils/mockData';
import { exportWalkthroughToExcel, exportWalkthroughToPPT } from '../utils/walkthroughExporter';
import {
  ChevronRight,
  ChevronLeft,
  Filter,
  Eye,
  Search,
  Wrench,
  Rocket,
  FileSpreadsheet,
  Presentation,
} from 'lucide-react';
import { WizardStepFunnel } from '../components/wizard/WizardStepFunnel';
import { WizardStepReviewing } from '../components/wizard/WizardStepReviewing';
import { WizardStepAnalysing } from '../components/wizard/WizardStepAnalysing';
import { WizardStepImplementing } from '../components/wizard/WizardStepImplementing';
import { WizardStepPostLaunch } from '../components/wizard/WizardStepPostLaunch';
import './WalkthroughWizard.css';

interface WalkthroughWizardProps {
  data: WalkthroughData;
  setData: React.Dispatch<React.SetStateAction<WalkthroughData>>;
}

const WIZARD_STEPS = [
  { id: 1, title: 'Funnel', icon: Filter },
  { id: 2, title: 'Reviewing', icon: Eye },
  { id: 3, title: 'Analysing', icon: Search },
  { id: 4, title: 'Implementing', icon: Wrench },
  { id: 5, title: 'Post Launch', icon: Rocket },
];

export function WalkthroughWizard({ data, setData }: WalkthroughWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const goNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const goPrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleChange = <K extends keyof WalkthroughData>(field: K, value: WalkthroughData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pi-wizard-view">
      <div className="pi-wizard-topbar">
        <div className="pi-step-indicators">
          {WIZARD_STEPS.map(step => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`pi-step-chip ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <span className="pi-step-number">{isCompleted ? '✓' : step.id}</span>
                <Icon size={14} />
                <span>{step.title}</span>
              </div>
            );
          })}
        </div>
        <div className="pi-export-actions">
          <button className="cyber-button" onClick={() => exportWalkthroughToExcel(data)} title="Extract Excel Report">
            <FileSpreadsheet size={16} />
            <span className="cyber-btn-text">Excel</span>
          </button>
          <button className="cyber-button secondary" onClick={() => exportWalkthroughToPPT(data)} title="Extract PPT Report">
            <Presentation size={16} />
            <span className="cyber-btn-text">PPT</span>
          </button>
        </div>
      </div>

      <div className="pi-step-progress-bar">
        <div className="pi-step-progress-fill" style={{ width: `${(currentStep / 5) * 100}%` }} />
      </div>

      <div className="pi-step-content">
        {currentStep === 1 && <WizardStepFunnel data={data} onChange={handleChange} />}
        {currentStep === 2 && <WizardStepReviewing data={data} onChange={handleChange} />}
        {currentStep === 3 && <WizardStepAnalysing data={data} onChange={handleChange} />}
        {currentStep === 4 && <WizardStepImplementing data={data} onChange={handleChange} />}
        {currentStep === 5 && <WizardStepPostLaunch data={data} onChange={handleChange} />}
      </div>

      <div className="pi-wizard-nav">
        <span className="pi-nav-info">Phase {currentStep} of 5 — {WIZARD_STEPS[currentStep - 1].title}</span>
        <div className="pi-nav-buttons">
          <button className="cyber-button secondary" onClick={goPrev} disabled={currentStep === 1}>
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
          <button className="cyber-button" onClick={goNext} disabled={currentStep === 5}>
            <span>{currentStep === 5 ? 'Complete' : 'Next'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
