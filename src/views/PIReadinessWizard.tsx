import React, { useState, useMemo } from 'react';
import { PIWizardData, PIChecklistItem, PICheckpointItem } from '../utils/mockData';
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Layers,
  Search,
  CheckCircle2,
  Route,
  AlertTriangle,
  Info,
  Zap,
  Target,
  CalendarCheck,
  Users,
  Lock
} from 'lucide-react';

interface PIReadinessWizardProps {
  data: PIWizardData;
  setData: React.Dispatch<React.SetStateAction<PIWizardData>>;
}

const WIZARD_STEPS = [
  { id: 1, title: 'PI Process Overview', icon: BookOpen },
  { id: 2, title: 'Key Stages', icon: Layers },
  { id: 3, title: 'Readiness Overview', icon: Search },
  { id: 4, title: 'Readiness Checklists', icon: CheckCircle2 },
  { id: 5, title: 'Post-Kickoff Checkpoints', icon: Route },
];

export function PIReadinessWizard({ data, setData }: PIReadinessWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const toggleReviewItem = (id: string) => {
    setData(prev => ({
      ...prev,
      reviewChecklist: prev.reviewChecklist.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const toggleAnalyseItem = (id: string) => {
    setData(prev => ({
      ...prev,
      analyseChecklist: prev.analyseChecklist.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const toggleCheckpoint = (id: string) => {
    setData(prev => ({
      ...prev,
      postKickoffCheckpoints: prev.postKickoffCheckpoints.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const readinessScore = useMemo(() => {
    const allItems = [
      ...data.reviewChecklist,
      ...data.analyseChecklist,
      ...data.postKickoffCheckpoints,
    ];
    const checked = allItems.filter(i => i.checked).length;
    return allItems.length === 0 ? 0 : Math.round((checked / allItems.length) * 100);
  }, [data]);

  const reviewProgress = useMemo(() => {
    const checked = data.reviewChecklist.filter(i => i.checked).length;
    return data.reviewChecklist.length === 0 ? 0 : Math.round((checked / data.reviewChecklist.length) * 100);
  }, [data.reviewChecklist]);

  const analyseProgress = useMemo(() => {
    const checked = data.analyseChecklist.filter(i => i.checked).length;
    return data.analyseChecklist.length === 0 ? 0 : Math.round((checked / data.analyseChecklist.length) * 100);
  }, [data.analyseChecklist]);

  const checkpointProgress = useMemo(() => {
    const checked = data.postKickoffCheckpoints.filter(i => i.checked).length;
    return data.postKickoffCheckpoints.length === 0 ? 0 : Math.round((checked / data.postKickoffCheckpoints.length) * 100);
  }, [data.postKickoffCheckpoints]);

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

        /* ── Top Bar: Step indicators + Score ── */
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

        /* Score Widget */
        .pi-score-widget {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: var(--bg-card);
          min-width: 200px;
        }

        .pi-score-ring {
          position: relative;
          width: 44px;
          height: 44px;
        }

        .pi-score-ring svg {
          transform: rotate(-90deg);
        }

        .pi-score-ring-bg {
          fill: none;
          stroke: rgba(255,255,255,0.06);
          stroke-width: 4;
        }

        .pi-score-ring-fill {
          fill: none;
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s;
        }

        .pi-score-ring-value {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          font-family: var(--font-mono);
        }

        .pi-score-label {
          font-size: 0.7rem;
          color: var(--color-text-secondary);
          line-height: 1.2;
        }

        .pi-score-label strong {
          display: block;
          font-size: 0.85rem;
          color: var(--color-text-primary);
        }

        /* ── Step Content ── */
        .pi-step-content {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        /* ── Navigation Footer ── */
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

        /* ── Content Panels ── */
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

        /* Info callout */
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

        .pi-callout-warning {
          background: rgba(245, 158, 11, 0.06);
          border-color: rgba(245, 158, 11, 0.2);
        }

        .pi-callout-warning .pi-callout-icon {
          color: var(--color-amber);
        }

        /* ── Stage Cards (Step 2) ── */
        .pi-stages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 0.75rem;
        }

        .pi-stage-card {
          background: var(--bg-card);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 1.25rem;
          transition: all var(--transition-fast);
        }

        .pi-stage-card:hover {
          border-color: var(--color-border-hover);
          box-shadow: var(--shadow-glow-cyan);
        }

        .pi-stage-card h4 {
          color: #e60000;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .pi-stage-card h4 .stage-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e60000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* ── Readiness Info Cards (Step 3) ── */
        .pi-readiness-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .pi-readiness-card {
          border: 2px solid #e60000;
          border-radius: 10px;
          overflow: hidden;
        }

        .pi-readiness-card-header {
          background: #e60000;
          color: #fff;
          padding: 0.6rem 1.25rem;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .pi-readiness-card-body {
          padding: 1rem 1.25rem;
        }

        /* ── Checklist Grid (Step 4) ── */
        .pi-checklist-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 900px) {
          .pi-checklist-grid {
            grid-template-columns: 1fr;
          }
          .pi-stages-grid {
            grid-template-columns: 1fr;
          }
        }

        .pi-checklist-column {
          background: var(--bg-card);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          overflow: hidden;
        }

        .pi-checklist-header {
          padding: 0.75rem 1.25rem;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
        }

        .pi-checklist-header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pi-checklist-progress-badge {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          background: rgba(0, 245, 160, 0.1);
          color: var(--color-green);
          border: 1px solid rgba(0, 245, 160, 0.2);
        }

        .pi-checklist-items {
          padding: 0.75rem 1rem;
        }

        .pi-check-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background var(--transition-fast);
          user-select: none;
        }

        .pi-check-item:hover {
          background: rgba(255,255,255,0.04);
        }

        .pi-check-item input[type="checkbox"] {
          width: 1.15rem;
          height: 1.15rem;
          accent-color: var(--color-green);
          cursor: pointer;
          flex-shrink: 0;
        }

        .pi-check-item.checked span {
          text-decoration: line-through;
          color: var(--color-text-secondary);
          opacity: 0.6;
        }

        .pi-check-item span {
          font-size: 0.88rem;
          color: var(--color-text-primary);
          transition: opacity 0.2s;
        }

        /* ── Timeline Flowchart (Step 5) ── */
        .pi-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          padding-left: 2rem;
        }

        .pi-timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #e60000, var(--color-cyan), var(--color-green));
          border-radius: 3px;
        }

        .pi-timeline-item {
          position: relative;
          padding: 0.75rem 0 0.75rem 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .pi-timeline-dot {
          position: absolute;
          left: -23px;
          top: 1.1rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid var(--color-border);
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all 0.3s;
        }

        .pi-timeline-dot.checked {
          background: var(--color-green);
          border-color: var(--color-green);
          box-shadow: 0 0 10px rgba(0, 245, 160, 0.4);
        }

        .pi-timeline-dot svg {
          width: 10px;
          height: 10px;
        }

        .pi-timeline-card {
          flex: 1;
          background: var(--bg-card);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 1rem 1.25rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .pi-timeline-card:hover {
          border-color: var(--color-border-hover);
          box-shadow: var(--shadow-glow-cyan);
        }

        .pi-timeline-card.checked {
          border-color: rgba(0, 245, 160, 0.3);
          background: rgba(0, 245, 160, 0.04);
        }

        .pi-timeline-card-title {
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-text-primary);
          margin-bottom: 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pi-timeline-card-title .tl-check-icon {
          color: var(--color-green);
        }

        .pi-timeline-card p {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        /* ── Step progress bar ── */
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

        {/* Readiness Score */}
        <div className="pi-score-widget">
          <div className="pi-score-ring">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle className="pi-score-ring-bg" cx="22" cy="22" r="18" />
              <circle
                className="pi-score-ring-fill"
                cx="22" cy="22" r="18"
                stroke={readinessScore >= 80 ? 'var(--color-green)' : readinessScore >= 40 ? 'var(--color-amber)' : '#e60000'}
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - readinessScore / 100)}`}
              />
            </svg>
            <span className="pi-score-ring-value" style={{
              color: readinessScore >= 80 ? 'var(--color-green)' : readinessScore >= 40 ? 'var(--color-amber)' : '#e60000'
            }}>
              {readinessScore}%
            </span>
          </div>
          <div className="pi-score-label">
            <strong>PI Readiness</strong>
            {data.reviewChecklist.filter(i => i.checked).length + data.analyseChecklist.filter(i => i.checked).length + data.postKickoffCheckpoints.filter(i => i.checked).length} / {data.reviewChecklist.length + data.analyseChecklist.length + data.postKickoffCheckpoints.length} items
          </div>
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
        {currentStep === 4 && renderStep4(data, toggleReviewItem, toggleAnalyseItem, reviewProgress, analyseProgress)}
        {currentStep === 5 && renderStep5(data, toggleCheckpoint, checkpointProgress)}
      </div>

      {/* Navigation Footer */}
      <div className="pi-wizard-nav">
        <span className="pi-nav-info">Step {currentStep} of 5 — {WIZARD_STEPS[currentStep - 1].title}</span>
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

/* ════════════════════════════════════════════════════════════════════════════
   Step Renderers
   ════════════════════════════════════════════════════════════════════════════ */

function renderStep1() {
  return (
    <>
      <div className="pi-panel">
        <div className="pi-panel-title">
          <BookOpen size={22} /> Vodafone's Digital PI Process
        </div>
        <div className="pi-highlight-box">
          <p>
            <strong>PI (Program Increment) Planning</strong> is a structured, cadence-based process aligned
            with <strong style={{ color: '#e60000' }}>SAFe principles</strong>, used to synchronise squads
            and portfolios every <strong>8–12 weeks</strong>. It ensures demand, capacity, and priorities are
            agreed before development starts.
          </p>
        </div>
        <ul>
          <li>
            PI normally spans <strong>12 weeks</strong>, which typically includes <strong>5 to 6 sprints</strong> (each
            sprint is usually 2 weeks long).
          </li>
        </ul>

        <div className="pi-callout">
          <Info size={18} className="pi-callout-icon" />
          <div>
            <p>Key dates for upcoming PI milestones can be found on the <strong>Digital Readiness Hub</strong>.</p>
            <p>PI Increments/Sprint dates can be found on the <strong>PI Increments – Overview</strong> page.</p>
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
          <Layers size={22} /> Key Stages in Vodafone's PI Process
        </div>
      </div>

      <div className="pi-stages-grid">
        <div className="pi-stage-card">
          <h4><span className="stage-num">1</span> Pre-PI Readiness</h4>
          <ul>
            <li><strong>Demand Alignment:</strong> Demand and priorities agreed in ADO across portfolios.</li>
            <li><strong>Soft Lock & Hard Lock Sessions:</strong> Confirm scope, budget, and capacity checkpoints.</li>
            <li><strong>Finance & Governance Reviews:</strong> Validate cost forecasts and compliance.</li>
            <li><strong>Readiness Reviews:</strong> Weekly sessions to track risks, dependencies, and mitigations.</li>
          </ul>
        </div>

        <div className="pi-stage-card">
          <h4><span className="stage-num">2</span> PI Planning Event</h4>
          <ul>
            <li><strong>Purpose:</strong> Align squads and stakeholders on PI objectives, capacity, and dependencies.</li>
            <li><strong>Outputs:</strong> Finalised PI priorities, PI objectives and roadmap, costing for forecasting, risk mitigation plans.</li>
          </ul>
        </div>

        <div className="pi-stage-card">
          <h4><span className="stage-num">3</span> Post-PI Activities</h4>
          <ul>
            <li>Continuous alignment on demand and readiness for next PI.</li>
            <li>Update Long-Range Planning (LRP) and manage spill-over items.</li>
          </ul>
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
          <Search size={22} /> Readiness Overview (Analysing Phase)
        </div>
      </div>

      <div className="pi-readiness-cards">
        <div className="pi-readiness-card">
          <div className="pi-readiness-card-header">What is Readiness?</div>
          <div className="pi-readiness-card-body">
            <ul>
              <li>The process of getting items ready for Build and PI Planning.</li>
              <li>Occurs during the <strong>Analysing phase</strong> of the Vision to Value framework.</li>
            </ul>
          </div>
        </div>

        <div className="pi-readiness-card">
          <div className="pi-readiness-card-header">How It Works</div>
          <div className="pi-readiness-card-body">
            <ul>
              <li>Takes approved items that have gone through business review and approval.</li>
              <li>In partnership with Product and Capability Teams (CX, SA, etc.), refines them to a <strong>build-ready state</strong>.</li>
            </ul>
          </div>
        </div>

        <div className="pi-readiness-card">
          <div className="pi-readiness-card-header">Key Guideline</div>
          <div className="pi-readiness-card-body">
            <ul>
              <li>Review and analyse deliverable dates for upcoming PIs.</li>
              <li>Refer to the <strong>Digital Delivery Dates</strong> table: PI Increments – Overview.</li>
            </ul>

            <div className="pi-callout pi-callout-warning" style={{ marginTop: '0.75rem' }}>
              <AlertTriangle size={16} className="pi-callout-icon" />
              <p><strong>Raise Risks Early</strong> — Flag any blockers as soon as they are identified to avoid PI delays.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function renderStep4(
  data: PIWizardData,
  toggleReviewItem: (id: string) => void,
  toggleAnalyseItem: (id: string) => void,
  reviewProgress: number,
  analyseProgress: number
) {
  return (
    <>
      <div className="pi-panel">
        <div className="pi-panel-title">
          <CheckCircle2 size={22} /> Readiness Checklist — Review & Analyse Phase
        </div>
        <p>Complete all items below to achieve full PI Readiness. Toggle each item as you progress through the phases.</p>
      </div>

      <div className="pi-checklist-grid">
        {/* Review Phase */}
        <div className="pi-checklist-column">
          <div className="pi-checklist-header">
            <div className="pi-checklist-header-title">
              <Target size={18} style={{ color: '#e60000' }} />
              <span>Review Phase</span>
            </div>
            <span className="pi-checklist-progress-badge">{reviewProgress}%</span>
          </div>
          <div className="pi-checklist-items">
            {data.reviewChecklist.map(item => (
              <label key={item.id} className={`pi-check-item ${item.checked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleReviewItem(item.id)}
                />
                <span>{item.checked ? '✓ ' : ''}{item.text}</span>
              </label>
            ))}
          </div>
          <div className="pi-callout pi-callout-warning" style={{ margin: '0 0.75rem 0.75rem' }}>
            <AlertTriangle size={14} className="pi-callout-icon" />
            <p><strong>Raise Risks Early</strong></p>
          </div>
        </div>

        {/* Analyse Phase */}
        <div className="pi-checklist-column">
          <div className="pi-checklist-header">
            <div className="pi-checklist-header-title">
              <Search size={18} style={{ color: '#e60000' }} />
              <span>Analyse Phase</span>
            </div>
            <span className="pi-checklist-progress-badge">{analyseProgress}%</span>
          </div>
          <div className="pi-checklist-items">
            {data.analyseChecklist.map(item => (
              <label key={item.id} className={`pi-check-item ${item.checked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleAnalyseItem(item.id)}
                />
                <span>{item.checked ? '✓ ' : ''}{item.text}</span>
              </label>
            ))}
          </div>
          <div className="pi-callout pi-callout-warning" style={{ margin: '0 0.75rem 0.75rem' }}>
            <AlertTriangle size={14} className="pi-callout-icon" />
            <p><strong>Raise Risks in Weekly Analyse Calls (Thu 11 AM)</strong></p>
          </div>
        </div>
      </div>
    </>
  );
}

function renderStep5(
  data: PIWizardData,
  toggleCheckpoint: (id: string) => void,
  checkpointProgress: number
) {
  const CHECKPOINT_ICONS = [CalendarCheck, Users, Zap, Users, Lock];
  return (
    <>
      <div className="pi-panel">
        <div className="pi-panel-title">
          <Route size={22} /> Readiness Checkpoints Post PI Planning Kick-off
        </div>
        <p>Mark each checkpoint as complete when your deliverables are confirmed. Current progress: <strong style={{ color: 'var(--color-green)' }}>{checkpointProgress}%</strong></p>
      </div>

      <div className="pi-timeline">
        {data.postKickoffCheckpoints.map((cp, idx) => {
          const Icon = CHECKPOINT_ICONS[idx] || CalendarCheck;
          return (
            <div key={cp.id} className="pi-timeline-item">
              <div className={`pi-timeline-dot ${cp.checked ? 'checked' : ''}`}>
                {cp.checked && <CheckCircle2 size={10} color="#000" />}
              </div>
              <div
                className={`pi-timeline-card ${cp.checked ? 'checked' : ''}`}
                onClick={() => toggleCheckpoint(cp.id)}
              >
                <div className="pi-timeline-card-title">
                  <Icon size={18} style={{ color: cp.checked ? 'var(--color-green)' : '#e60000' }} />
                  {cp.title}
                  {cp.checked && <CheckCircle2 size={16} className="tl-check-icon" />}
                </div>
                <p>{cp.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
