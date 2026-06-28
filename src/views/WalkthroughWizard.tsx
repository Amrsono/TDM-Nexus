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
  CheckCircle2,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';

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

  const handleChange = (field: keyof WalkthroughData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pi-wizard-view">
      <style>{`
        .pi-wizard-view {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          color: var(--color-text-primary);
        }

        .pi-wizard-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 0.75rem;
        }

        .pi-step-indicators {
          display: flex;
          gap: 0.25rem;
          flex: 1;
        }

        .pi-step-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          font-size: 0.8rem;
          font-family: var(--font-mono);
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.03);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .pi-step-chip:hover {
          background: rgba(255,255,255,0.06);
          color: var(--color-text-primary);
        }

        .pi-step-chip.active {
          background: rgba(230, 0, 0, 0.12);
          border-color: #e60000;
          color: #e60000;
          box-shadow: 0 0 12px rgba(230,0,0,0.2);
        }

        .pi-step-chip.completed {
          background: rgba(0, 245, 160, 0.08);
          border-color: rgba(0, 245, 160, 0.3);
          color: var(--color-green);
        }

        .pi-step-number {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          background: rgba(255,255,255,0.08);
          color: var(--color-text-secondary);
        }

        .pi-step-chip.active .pi-step-number {
          background: #e60000;
          color: #fff;
        }

        .pi-step-chip.completed .pi-step-number {
          background: var(--color-green);
          color: #000;
        }

        .pi-export-actions {
          display: flex;
          gap: 0.5rem;
        }

        .pi-step-content {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .pi-wizard-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--color-border);
          padding-top: 0.75rem;
        }

        .pi-nav-info {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          font-family: var(--font-mono);
        }

        .pi-nav-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .pi-panel {
          background: var(--bg-card);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1rem;
        }

        .pi-panel-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #e60000;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pi-panel p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.4rem;
          font-weight: 500;
        }

        .form-control {
          width: 100%;
          background: var(--bg-primary);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          padding: 0.6rem 0.8rem;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          transition: border-color var(--transition-fast);
        }

        .form-control:focus {
          outline: none;
          border-color: var(--color-cyan);
        }

        textarea.form-control {
          resize: vertical;
          min-height: 80px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--color-text-primary);
          user-select: none;
          margin-bottom: 0.75rem;
        }

        .checkbox-label input[type="checkbox"] {
          width: 1.1rem;
          height: 1.1rem;
          accent-color: var(--color-cyan);
        }

        .pi-step-progress-bar {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .pi-step-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #e60000, var(--color-green));
          border-radius: 2px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
      `}</style>

      {/* Top Bar */}
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
            <span>Excel</span>
          </button>
          <button className="cyber-button secondary" onClick={() => exportWalkthroughToPPT(data)} title="Extract PPT Report">
            <Presentation size={16} />
            <span>PPT</span>
          </button>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="pi-step-progress-bar">
        <div className="pi-step-progress-fill" style={{ width: `${(currentStep / 5) * 100}%` }} />
      </div>

      {/* Step Content */}
      <div className="pi-step-content">
        {currentStep === 1 && renderStep1(data, handleChange)}
        {currentStep === 2 && renderStep2(data, handleChange)}
        {currentStep === 3 && renderStep3(data, handleChange)}
        {currentStep === 4 && renderStep4(data, handleChange)}
        {currentStep === 5 && renderStep5(data, handleChange)}
      </div>

      {/* Navigation Footer */}
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

function renderStep1(data: WalkthroughData, handleChange: Function) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Filter size={22} /> Phase 1: Funnel
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Capture ideas, scope demands, and evaluate high-level resourcing before investing heavily into design.</p>
      
      <div className="form-group">
        <label>Epic / Initiative Name</label>
        <input 
          type="text" 
          className="form-control" 
          value={data.epicName} 
          onChange={(e) => handleChange('epicName', e.target.value)} 
          placeholder="e.g., MVO iPhone Upgrade Journey" 
        />
      </div>

      <div className="form-group">
        <label>Idea Description</label>
        <textarea 
          className="form-control" 
          value={data.ideaDescription} 
          onChange={(e) => handleChange('ideaDescription', e.target.value)} 
          placeholder="Briefly describe the demand and business value." 
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Target Portfolio / Channel</label>
          <select 
            className="form-control"
            value={data.portfolio}
            onChange={(e) => handleChange('portfolio', e.target.value)}
          >
            <option value="">Select a Portfolio...</option>
            <option value="MVO (eShop)">MVO (eShop)</option>
            <option value="eCare">eCare</option>
            <option value="My Vodafone App (MVA)">My Vodafone App (MVA)</option>
            <option value="TOBi">TOBi</option>
            <option value="Platform">Platform / Shared</option>
          </select>
        </div>
        <div className="form-group">
          <label>Resource Assessment</label>
          <select 
            className="form-control"
            value={data.resourceAssessment}
            onChange={(e) => handleChange('resourceAssessment', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Low">Low Effort</option>
            <option value="Medium">Medium Effort</option>
            <option value="High">High Effort</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function renderStep2(data: WalkthroughData, handleChange: Function) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Eye size={22} /> Phase 2: Reviewing
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Validate the concept, create a high-level business case, and make the Stop/Go decision for mobilization.</p>
      
      <div className="grid-2">
        <div>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={data.impactAssessmentDone} 
              onChange={(e) => handleChange('impactAssessmentDone', e.target.checked)} 
            />
            Impact Assessment Completed
          </label>
          
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={data.vvromCreated} 
              onChange={(e) => handleChange('vvromCreated', e.target.checked)} 
            />
            VVROM Created
          </label>

          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={data.lrpUpdated} 
              onChange={(e) => handleChange('lrpUpdated', e.target.checked)} 
            />
            LRP Updated
          </label>
        </div>
        
        <div className="form-group">
          <label>Stop/Go Decision for Mobilization</label>
          <select 
            className="form-control"
            value={data.stopGoDecision}
            onChange={(e) => handleChange('stopGoDecision', e.target.value)}
            style={{ 
              borderColor: data.stopGoDecision === 'Go' ? 'var(--color-green)' : 
                           data.stopGoDecision === 'Stop' ? 'var(--color-amber)' : ''
            }}
          >
            <option value="Pending">Pending Review</option>
            <option value="Stop">Stop (Do not mobilize)</option>
            <option value="Go">Go (Approved for Analysing)</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>High-Level Business Case</label>
        <textarea 
          className="form-control" 
          value={data.highLevelBusinessCase} 
          onChange={(e) => handleChange('highLevelBusinessCase', e.target.value)} 
          placeholder="Provide high-level ROI or customer impact metrics." 
        />
      </div>

      <div className="form-group">
        <label>Mobilization Plan</label>
        <textarea 
          className="form-control" 
          value={data.mobilizationPlan} 
          onChange={(e) => handleChange('mobilizationPlan', e.target.value)} 
          placeholder="Detail which teams/squads are mobilizing." 
        />
      </div>
    </div>
  );
}

function renderStep3(data: WalkthroughData, handleChange: Function) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Search size={22} /> Phase 3: Analysing
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Refine the scope, blueprint designs, and sign-off on detailed specifications prior to build.</p>
      
      <div className="grid-2">
        <div>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={data.brsSignedOff} 
              onChange={(e) => handleChange('brsSignedOff', e.target.checked)} 
            />
            Business Requirement Spec (BRS) Signed Off
          </label>
          
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={data.hldStarted} 
              onChange={(e) => handleChange('hldStarted', e.target.checked)} 
            />
            High Level Design (HLD) Started
          </label>

          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={data.tilSpecsComplete} 
              onChange={(e) => handleChange('tilSpecsComplete', e.target.checked)} 
            />
            TIL SOA Specs Complete
          </label>
        </div>
        
        <div className="form-group">
          <label>Estimated Timeline (Weeks)</label>
          <input 
            type="number" 
            className="form-control" 
            value={data.timelineWeeks} 
            onChange={(e) => handleChange('timelineWeeks', parseInt(e.target.value) || 0)} 
          />
        </div>
      </div>
    </div>
  );
}

function renderStep4(data: WalkthroughData, handleChange: Function) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Wrench size={22} /> Phase 4: Implementing
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Build the solution and progress through quality assurance (SIT, UAT, PAT, PEN, CJT).</p>
      
      <div className="grid-2">
        <div className="form-group">
          <label>MVP Build Status</label>
          <select 
            className="form-control"
            value={data.mvpBuildStatus}
            onChange={(e) => handleChange('mvpBuildStatus', e.target.value)}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        <div className="form-group">
          <label>Commercial Go/No-Go Decision</label>
          <select 
            className="form-control"
            value={data.commercialGoNoGo}
            onChange={(e) => handleChange('commercialGoNoGo', e.target.value)}
            style={{ 
              borderColor: data.commercialGoNoGo === 'Go' ? 'var(--color-green)' : 
                           data.commercialGoNoGo === 'No-Go' ? '#e60000' : ''
            }}
          >
            <option value="Pending">Pending Validation</option>
            <option value="No-Go">No-Go (Issues remaining)</option>
            <option value="Go">Go (Ready for launch!)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <h4 style={{ color: 'var(--color-cyan)', fontSize: '0.95rem', marginBottom: '1rem' }}>Testing Checkpoints</h4>
        <div className="grid-2">
          <div>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={data.sitTesting} 
                onChange={(e) => handleChange('sitTesting', e.target.checked)} 
              />
              SIT Completed (System Integration)
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={data.uatTesting} 
                onChange={(e) => handleChange('uatTesting', e.target.checked)} 
              />
              UAT Completed (User Acceptance)
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={data.patTesting} 
                onChange={(e) => handleChange('patTesting', e.target.checked)} 
              />
              PAT Completed (Performance)
            </label>
          </div>
          <div>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={data.cjtTesting} 
                onChange={(e) => handleChange('cjtTesting', e.target.checked)} 
              />
              CJT Completed (Customer Journey)
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
              * Note: Any P1/P2 defects identified during CJT must be resolved before Commercial Launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderStep5(data: WalkthroughData, handleChange: Function) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Rocket size={22} /> Phase 5: Post Launch
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Monitor performance, resolve issues in Early Life Support (ELS), and document learnings.</p>
      
      <div className="grid-2">
        <div className="form-group">
          <label>P1/P2 Defects Remaining</label>
          <input 
            type="number" 
            className="form-control" 
            value={data.p1p2DefectsRemaining} 
            onChange={(e) => handleChange('p1p2DefectsRemaining', parseInt(e.target.value) || 0)} 
          />
        </div>
        
        <div>
          <label className="checkbox-label" style={{ marginTop: '1.4rem' }}>
            <input 
              type="checkbox" 
              checked={data.elsActive} 
              onChange={(e) => handleChange('elsActive', e.target.checked)} 
            />
            Early Life Support (ELS) Currently Active
          </label>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>Retrospective Notes & Lessons Learned</label>
        <textarea 
          className="form-control" 
          value={data.retrospectiveNotes} 
          onChange={(e) => handleChange('retrospectiveNotes', e.target.value)} 
          placeholder="Document what went well and what could be improved for next time." 
        />
      </div>

      {data.p1p2DefectsRemaining === 0 && !data.elsActive && data.commercialGoNoGo === 'Go' && (
        <div className="pi-highlight-box" style={{ borderColor: 'var(--color-green)', background: 'rgba(0,245,160,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-green)' }}>
            <CheckCircle2 size={24} />
            <span style={{ fontWeight: 600 }}>Project Complete & Handed Over to BAU</span>
          </div>
        </div>
      )}
    </div>
  );
}
