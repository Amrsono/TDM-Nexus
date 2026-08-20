import { useState } from 'react';
import { FileSliders, FileDown, Eye } from 'lucide-react';
import { POAPSlideData } from '../types/poap';
import { exampleMilestones } from '../utils/timelineLayout';
import { exportPOAPSlideDeck } from '../utils/poapPptxExporter';
import { ScaledSlidePreview } from '../components/poap/SlidePreview';
import { POAPMilestoneTable } from '../components/poap/POAPMilestoneTable';

export function POAPSlideBuilder() {
  const [form, setForm] = useState<POAPSlideData>({
    projectName: 'MS Dynamics AX',
    reqId: '100473',
    projectManager: 'Amr Sono',
    expectedClosure: '2027-02-28',
    portfolio: 'Dynamics AX',
    transition: 'Active',
    ragOverall: 'Green',
    mpGate: 'Pass',
    build: 'Completed',
    projectGate: 'Active',
    projectScope: 'Deliver AX Solution\nIntegrate POS systems\nDevelop DevOps pipeline',
    currentStatus: 'On track with build sprints\nSIT preparation starting\nTraining materials drafting',
    milestones: exampleMilestones,
    obstacles: 'Resource availability for legacy systems during transition',
    planAssumptions: 'Azure licenses will be approved on time\nEnvironments are stable',
  });

  const [previewSlide, setPreviewSlide] = useState<1 | 2 | 3>(3);

  const set = <K extends keyof POAPSlideData>(key: K, val: POAPSlideData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleGenerateSlide = () => {
    exportPOAPSlideDeck(form);
  };

  return (
    <div className="poap-slide-builder-layout">
      {/* LEFT: Form */}
      <div className="poap-slide-builder-form-pane">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSliders size={18} style={{ color: 'var(--color-cyan)' }} />
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Fill in and preview live →
            </span>
          </div>
          <button className="cyber-button" onClick={handleGenerateSlide} style={{ fontSize: '0.8rem' }}>
            <FileDown size={14} /> <span className="cyber-btn-text">Make as Slide</span>
          </button>
        </div>

        {/* Section 1: Header */}
        <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem', minWidth: 0 }}>
          <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '0 0.5rem', fontWeight: 700 }}>
            Project Header
          </legend>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Project Name</label>
              <input className="cyber-input" value={form.projectName} onChange={e => set('projectName', e.target.value)} placeholder="e.g. VOIS Support" />
            </div>
            <div className="form-group">
              <label>REQ ID</label>
              <input className="cyber-input" value={form.reqId} onChange={e => set('reqId', e.target.value)} placeholder="883471" />
            </div>
            <div className="form-group">
              <label>Project Manager</label>
              <input className="cyber-input" value={form.projectManager} onChange={e => set('projectManager', e.target.value)} placeholder="Amr Sono" />
            </div>
            <div className="form-group">
              <label>Expected Closure</label>
              <input className="cyber-input" type="date" value={form.expectedClosure} onChange={e => set('expectedClosure', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Portfolio</label>
              <input className="cyber-input" value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="Transition" />
            </div>
            <div className="form-group">
              <label>Transition</label>
              <input className="cyber-input" value={form.transition} onChange={e => set('transition', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Overall RAG</label>
              <select
                className="cyber-input"
                value={form.ragOverall}
                onChange={e => set('ragOverall', e.target.value as 'Green' | 'Amber' | 'Red')}
              >
                <option value="Green">Green</option>
                <option value="Amber">Amber</option>
                <option value="Red">Red</option>
              </select>
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: '0.75rem', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div className="form-group"><label>MP Gate</label><input className="cyber-input" value={form.mpGate} onChange={e => set('mpGate', e.target.value)} /></div>
            <div className="form-group"><label>Build</label><input className="cyber-input" value={form.build} onChange={e => set('build', e.target.value)} /></div>
            <div className="form-group"><label>Project Gate</label><input className="cyber-input" value={form.projectGate} onChange={e => set('projectGate', e.target.value)} /></div>
          </div>
        </fieldset>

        {/* Section 2: Scope & Status */}
        <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem', minWidth: 0 }}>
          <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '0 0.5rem', fontWeight: 700 }}>
            Scope & Status
          </legend>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Project Scope (one per line)</label>
              <textarea
                className="cyber-input"
                rows={5}
                value={form.projectScope}
                onChange={e => set('projectScope', e.target.value)}
                placeholder="Define scope items..."
                style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
              />
            </div>
            <div className="form-group">
              <label>Current Status (one bullet per line)</label>
              <textarea
                className="cyber-input"
                rows={5}
                value={form.currentStatus}
                onChange={e => set('currentStatus', e.target.value)}
                placeholder="Status updates..."
                style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
              />
            </div>
          </div>
        </fieldset>

        {/* Section 3: Milestones */}
        <POAPMilestoneTable
          milestones={form.milestones}
          onChange={updated => set('milestones', updated)}
        />

        {/* Section 4: Obstacles & Assumptions */}
        <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem', minWidth: 0 }}>
          <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '0 0.5rem', fontWeight: 700 }}>
            Obstacles & Assumptions
          </legend>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>SteerCo/ExCo Obstacles</label>
              <textarea
                className="cyber-input"
                rows={3}
                value={form.obstacles}
                onChange={e => set('obstacles', e.target.value)}
                placeholder="What obstacles need help?"
                style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
              />
            </div>
            <div className="form-group">
              <label>Plan Assumptions (one per line)</label>
              <textarea
                className="cyber-input"
                rows={3}
                value={form.planAssumptions}
                onChange={e => set('planAssumptions', e.target.value)}
                placeholder="Key assumptions..."
                style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
              />
            </div>
          </div>
        </fieldset>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="poap-slide-builder-preview-pane">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={16} style={{ color: 'var(--color-cyan)' }} />
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>LIVE PREVIEW</span>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              className={`cyber-button ${previewSlide === 1 ? '' : 'secondary'}`}
              style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem' }}
              onClick={() => setPreviewSlide(1)}
            >
              Slide 1 – Status
            </button>
            <button
              className={`cyber-button ${previewSlide === 2 ? '' : 'secondary'}`}
              style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem' }}
              onClick={() => setPreviewSlide(2)}
            >
              Slide 2 – Plan
            </button>
            <button
              className={`cyber-button ${previewSlide === 3 ? '' : 'secondary'}`}
              style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem' }}
              onClick={() => setPreviewSlide(3)}
            >
              Slide 3 – Delivery Plan
            </button>
          </div>
        </div>

        <div style={{
          flex: 1, border: '1px solid var(--color-border)', borderRadius: '8px',
          padding: '0.75rem', overflow: 'auto', background: 'var(--bg-secondary)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        }}>
          <div style={{ width: '100%', maxWidth: 700 }}>
            <ScaledSlidePreview form={form} activeSlide={previewSlide} />
          </div>
        </div>

        <button className="cyber-button" onClick={handleGenerateSlide} style={{ alignSelf: 'center', padding: '0.6rem 2rem', fontSize: '0.9rem' }}>
          <FileDown size={16} /> Make as Slide
        </button>
      </div>
    </div>
  );
}
