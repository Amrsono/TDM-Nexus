import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Filter,
  Eye,
  Search,
  Wrench,
  Rocket,
  CheckCircle2,
  Info,
  Clock,
  FileText,
  Activity
} from 'lucide-react';

const WIZARD_STEPS = [
  { id: 1, title: 'Funnel', icon: Filter },
  { id: 2, title: 'Reviewing', icon: Eye },
  { id: 3, title: 'Analysing', icon: Search },
  { id: 4, title: 'Implementing', icon: Wrench },
  { id: 5, title: 'Post Launch', icon: Rocket },
];

export function WalkthroughWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const goNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const goPrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

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

        .pi-panel p, .pi-panel li {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .pi-panel strong {
          color: var(--color-text-primary);
        }

        .pi-panel ul {
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }

        .pi-panel li {
          margin-bottom: 0.3rem;
        }

        .pi-highlight-box {
          border: 2px solid #e60000;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          margin: 0.75rem 0;
          background: rgba(230, 0, 0, 0.04);
        }

        .pi-highlight-box p {
          color: var(--color-text-primary);
        }

        .pi-callout {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          background: rgba(0, 242, 254, 0.06);
          border: 1px solid rgba(0, 242, 254, 0.15);
          margin: 0.75rem 0;
        }

        .pi-callout-icon {
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--color-cyan);
        }

        .pi-callout p {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 0.85rem;
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

        .grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .info-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--color-border);
          padding: 1rem;
          border-radius: 8px;
        }

        .info-card h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-cyan);
          margin-bottom: 0.5rem;
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
      </div>

      {/* Step progress bar */}
      <div className="pi-step-progress-bar">
        <div className="pi-step-progress-fill" style={{ width: `${(currentStep / 5) * 100}%` }} />
      </div>

      {/* Step Content */}
      <div className="pi-step-content">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
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

function renderStep1() {
  return (
    <>
      <div className="pi-panel">
        <div className="pi-panel-title">
          <Filter size={22} /> The Funnel Phase
        </div>
        <div className="pi-highlight-box">
          <p>
            The Funnel phase is the starting point of the epic lifecycle, where ideas are captured, scoped, and prioritized. Here, product owners refine propositions and bring demands for portfolio consultation.
          </p>
        </div>
        
        <div className="grid-cards">
          <div className="info-card">
            <h4><Activity size={18} /> Key Activities</h4>
            <ul>
              <li>Capturing and scoping ideas</li>
              <li>Reviewing epics for strategic alignment</li>
              <li>Prioritizing based on business value</li>
              <li>Assessing resources at a high level</li>
              <li>Engaging stakeholders early</li>
            </ul>
          </div>
          <div className="info-card">
            <h4><FileText size={18} /> Artifacts & Output</h4>
            <ul>
              <li>There are typically <strong>no formal artifacts</strong> at this stage.</li>
            </ul>
          </div>
        </div>

        <div className="pi-callout">
          <Clock size={18} className="pi-callout-icon" />
          <div>
            <p><strong>Indicative Timeline:</strong> This phase usually takes 1–2 months.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function renderStep2() {
  return (
    <>
      <div className="pi-panel">
        <div className="pi-panel-title">
          <Eye size={22} /> The Reviewing Phase
        </div>
        <div className="pi-highlight-box">
          <p>
            The Reviewing phase is a checkpoint where the epic concept is validated and prepared for deeper analysis.
          </p>
        </div>

        <div className="grid-cards">
          <div className="info-card">
            <h4><Activity size={18} /> Key Activities</h4>
            <ul>
              <li>Defining the epic's description and business value</li>
              <li>Outlining solution capabilities</li>
              <li>Aligning resources</li>
              <li>Conducting impact assessments</li>
              <li>Creating a high-level business case</li>
              <li>Developing a mobilization plan</li>
              <li>Making a Stop/Go decision for mobilization</li>
            </ul>
          </div>
          <div className="info-card">
            <h4><FileText size={18} /> Artifacts & Output</h4>
            <ul>
              <li>Shaping documents</li>
              <li>Impact assessments</li>
              <li>Delivery timelines</li>
              <li>VVROM</li>
              <li>Updated LRP</li>
            </ul>
          </div>
        </div>

        <div className="pi-callout">
          <Clock size={18} className="pi-callout-icon" />
          <div>
            <p><strong>Indicative Timeline:</strong> 4–6 weeks, depending on work in progress.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function renderStep3() {
  return (
    <>
      <div className="pi-panel">
        <div className="pi-panel-title">
          <Search size={22} /> The Analysing Phase
        </div>
        <div className="pi-highlight-box">
          <p>
            The Analyzing phase is critical for refining the idea into a well-defined scope, ensuring all impacted areas understand requirements.
          </p>
        </div>

        <div className="grid-cards">
          <div className="info-card">
            <h4><Activity size={18} /> Key Activities</h4>
            <ul>
              <li>Creating high-level solution designs</li>
              <li>Blueprinting readiness (Service Design, BRS, Digital Solution)</li>
              <li>Engaging stakeholders</li>
              <li>Estimating timelines and resource needs</li>
              <li>Developing a detailed business case</li>
              <li>Assessing GTM impact</li>
              <li>Portfolio Sync & Stop/Go validation</li>
            </ul>
          </div>
          <div className="info-card">
            <h4><FileText size={18} /> Artifacts & Output</h4>
            <ul>
              <li>BRS documents & UX designs</li>
              <li>HLDs & TIL specs</li>
              <li>Digital blueprints</li>
              <li>Feature definitions & Dependency maps</li>
              <li>POAPs</li>
            </ul>
          </div>
        </div>

        <div className="pi-callout">
          <Clock size={18} className="pi-callout-icon" />
          <div>
            <p><strong>Indicative Timeline:</strong> 8–20 weeks, depending on project size.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function renderStep4() {
  return (
    <>
      <div className="pi-panel">
        <div className="pi-panel-title">
          <Wrench size={22} /> The Implementing Phase
        </div>
        <div className="pi-highlight-box">
          <p>
            In the Implementing phase, the approved epic moves into solution build and delivery, following SAFe Agile methodology.
          </p>
        </div>

        <div className="grid-cards">
          <div className="info-card">
            <h4><Activity size={18} /> Key Activities</h4>
            <ul>
              <li>Building and evaluating MVPs</li>
              <li>Engaging stakeholders</li>
              <li>System (SIT), UAT, PAT, PEN, and CJT testing</li>
              <li>Monitoring budgets and compliance</li>
              <li>Managing change and risks</li>
              <li>Go/No Go validation for commercial launch</li>
            </ul>
          </div>
          <div className="info-card">
            <h4><FileText size={18} /> Artifacts & Output</h4>
            <ul>
              <li>Updated delivery plans</li>
              <li>RAID logs</li>
              <li>Lessons learned</li>
              <li>Hyper-care plans</li>
              <li>Go/No Go documentation</li>
            </ul>
          </div>
        </div>

        <div className="pi-callout">
          <Clock size={18} className="pi-callout-icon" />
          <div>
            <p><strong>Indicative Timeline:</strong> Varies by scope, typically 8–20 weeks.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function renderStep5() {
  return (
    <>
      <div className="pi-panel">
        <div className="pi-panel-title">
          <Rocket size={22} /> The Post Launch Phase
        </div>
        <div className="pi-highlight-box">
          <p>
            After launch, the focus shifts to performance review, issue resolution, and continuous improvement. Early Life Support (ELS) is activated to ensure stability.
          </p>
        </div>

        <div className="grid-cards">
          <div className="info-card">
            <h4><Activity size={18} /> Key Activities</h4>
            <ul>
              <li>Early Life Support (ELS) for rapid issue resolution</li>
              <li>Updating risk registers</li>
              <li>Holding retrospective meetings</li>
              <li>Documenting lessons learned</li>
              <li>Managing backlog for future releases</li>
              <li>Final portfolio sync for epic closure</li>
            </ul>
          </div>
          <div className="info-card">
            <h4><Info size={18} /> Exit Criteria</h4>
            <ul>
              <li>No P1/P2 defects remain</li>
              <li>Performance and analytics dashboard metrics meet baseline</li>
              <li>Typically lasts 2 weeks post go-live</li>
            </ul>
          </div>
        </div>

        <div className="pi-callout">
          <CheckCircle2 size={18} className="pi-callout-icon" />
          <div>
            <p><strong>Goal:</strong> Ensures customers do not encounter major failures during the initial usage period, protecting the customer experience.</p>
          </div>
        </div>
      </div>
    </>
  );
}
