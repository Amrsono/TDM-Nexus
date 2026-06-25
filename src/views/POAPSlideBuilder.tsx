import React, { useState } from 'react';
import { FileSliders, Plus, Trash2, FileDown } from 'lucide-react';
import pptxgen from 'pptxgenjs';

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface MilestoneRow {
  id: number;
  name: string;
  status: string;
  targetedDate: string;
  releaseDate: string;
  actualDate: string;
}

interface POAPSlideData {
  projectName: string;
  reqId: string;
  projectManager: string;
  expectedClosure: string;
  portfolio: string;
  transition: string;
  ragOverall: 'Green' | 'Amber' | 'Red';
  mpGate: string;
  build: string;
  projectGate: string;
  projectScope: string;
  currentStatus: string;
  milestones: MilestoneRow[];
  obstacles: string;
  // Milestones Plan (Slide 2)
  planAssumptions: string;
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export function POAPSlideBuilder() {
  const [form, setForm] = useState<POAPSlideData>({
    projectName: '',
    reqId: '',
    projectManager: '',
    expectedClosure: '',
    portfolio: '',
    transition: '',
    ragOverall: 'Green',
    mpGate: '',
    build: '',
    projectGate: '',
    projectScope: '',
    currentStatus: '',
    milestones: [
      { id: 1, name: '', status: '', targetedDate: '', releaseDate: '', actualDate: '' },
    ],
    obstacles: '',
    planAssumptions: '',
  });

  /* ── helpers ── */
  const set = <K extends keyof POAPSlideData>(key: K, val: POAPSlideData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const setMilestone = (idx: number, field: keyof MilestoneRow, val: string) => {
    const updated = [...form.milestones];
    (updated[idx] as any)[field] = val;
    set('milestones', updated);
  };

  const addMilestone = () => {
    set('milestones', [
      ...form.milestones,
      { id: form.milestones.length + 1, name: '', status: '', targetedDate: '', releaseDate: '', actualDate: '' },
    ]);
  };

  const removeMilestone = (idx: number) => {
    if (form.milestones.length <= 1) return;
    set('milestones', form.milestones.filter((_, i) => i !== idx));
  };

  /* ── slide generation ── */
  const generateSlide = () => {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5

    const WHITE = 'FFFFFF';
    const BLACK = '000000';
    const DARK_RED = 'C00000';
    const RED = 'FF0000';
    const LIGHT_GRAY = 'F2F2F2';
    const BORDER_GRAY = 'BFBFBF';

    const ragColor = (val: string) => {
      if (val === 'Green') return '00B050';
      if (val === 'Amber') return 'FFC000';
      return 'FF0000';
    };

    /* ──────────── SLIDE 1: Project Status Report ──────────── */
    const s1 = pptx.addSlide();
    s1.background = { color: WHITE };

    // Top Header Row ─ Red bar with project name
    s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.55, fill: { color: DARK_RED } });
    s1.addText(`IITC – ${form.projectName}`, {
      x: 0.2, y: 0.05, w: 4.5, h: 0.45,
      fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial',
    });

    // Header fields row
    const headerFields = [
      { label: 'REQ ID', value: form.reqId, x: 5.0 },
      { label: 'Expected Closure', value: form.expectedClosure, x: 7.0 },
      { label: 'Portfolio', value: form.portfolio, x: 9.0 },
      { label: 'Transition', value: form.transition, x: 10.2 },
    ];
    headerFields.forEach(f => {
      s1.addText(f.label, { x: f.x, y: 0.05, w: 1.8, h: 0.2, fontSize: 7, color: LIGHT_GRAY, fontFace: 'Arial' });
      s1.addText(f.value || '—', { x: f.x, y: 0.25, w: 1.8, h: 0.25, fontSize: 9, bold: true, color: WHITE, fontFace: 'Arial' });
    });

    // RAG box
    s1.addText('RAG', { x: 11.4, y: 0.05, w: 0.6, h: 0.2, fontSize: 7, color: LIGHT_GRAY, fontFace: 'Arial' });
    s1.addShape(pptx.ShapeType.rect, { x: 11.4, y: 0.25, w: 0.7, h: 0.25, fill: { color: ragColor(form.ragOverall) } });

    // Project Manager row
    s1.addText(`Project Manager: ${form.projectManager}`, {
      x: 0.2, y: 0.65, w: 4.0, h: 0.25,
      fontSize: 9, bold: true, color: BLACK, fontFace: 'Arial',
    });

    // Gate fields
    const gateFields = [
      { label: 'MP Gate', value: form.mpGate, x: 7.0 },
      { label: 'Build', value: form.build, x: 8.5 },
      { label: 'Project Gate', value: form.projectGate, x: 10.0 },
    ];
    gateFields.forEach(f => {
      s1.addText(f.label, { x: f.x, y: 0.6, w: 1.3, h: 0.15, fontSize: 7, color: '666666', fontFace: 'Arial' });
      s1.addText(f.value || '—', { x: f.x, y: 0.75, w: 1.3, h: 0.2, fontSize: 9, bold: true, color: BLACK, fontFace: 'Arial' });
    });

    // Divider
    s1.addShape(pptx.ShapeType.rect, { x: 0.2, y: 1.0, w: 12.9, h: 0.02, fill: { color: BORDER_GRAY } });

    // Left side - Project Scope & Current Status
    s1.addText('Project Scope', {
      x: 0.2, y: 1.1, w: 5.5, h: 0.3,
      fontSize: 10, bold: true, color: BLACK, fontFace: 'Arial', underline: { style: 'sng' },
    });

    const scopeLines = (form.projectScope || '').split('\n').filter(Boolean);
    const scopeTextRuns = scopeLines.map((line, i) => ({
      text: `${i + 1}. ${line}\n`,
      options: { fontSize: 8, color: BLACK, fontFace: 'Arial' as const },
    }));
    if (scopeTextRuns.length > 0) {
      s1.addText(scopeTextRuns, { x: 0.3, y: 1.45, w: 5.2, h: 2.2, valign: 'top', lineSpacing: 14 });
    }

    s1.addText('Current Status', {
      x: 0.2, y: 3.7, w: 5.5, h: 0.3,
      fontSize: 10, bold: true, color: BLACK, fontFace: 'Arial', underline: { style: 'sng' },
    });
    const statusLines = (form.currentStatus || '').split('\n').filter(Boolean);
    const statusTextRuns = statusLines.map(line => ({
      text: `• ${line}\n`,
      options: { fontSize: 8, color: BLACK, fontFace: 'Arial' as const },
    }));
    if (statusTextRuns.length > 0) {
      s1.addText(statusTextRuns, { x: 0.3, y: 4.05, w: 5.2, h: 1.5, valign: 'top', lineSpacing: 14 });
    }

    // Right side - Milestones Table
    s1.addShape(pptx.ShapeType.rect, { x: 6.0, y: 1.1, w: 7.1, h: 0.3, fill: { color: DARK_RED } });
    const msHeaders = ['', 'Project Milestones', 'Status', 'Targeted\nDate', 'Release\nDate', 'Actual\nDate'];
    const msColWidths = [0.35, 2.2, 1.0, 1.0, 1.0, 1.0];
    let msX = 6.0;
    msHeaders.forEach((h, i) => {
      s1.addText(h, {
        x: msX, y: 1.1, w: msColWidths[i], h: 0.3,
        fontSize: 7, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle',
      });
      msX += msColWidths[i];
    });

    // Milestone rows
    form.milestones.forEach((ms, rowIdx) => {
      let colX = 6.0;
      const yPos = 1.42 + rowIdx * 0.42;
      const rowFill = rowIdx % 2 === 0 ? LIGHT_GRAY : WHITE;

      const cellData = [
        String(rowIdx + 1),
        ms.name || '',
        ms.status || '',
        ms.targetedDate || '',
        ms.releaseDate || '',
        ms.actualDate || '',
      ];

      cellData.forEach((cellText, cIdx) => {
        s1.addShape(pptx.ShapeType.rect, {
          x: colX, y: yPos, w: msColWidths[cIdx], h: 0.42,
          fill: { color: rowFill }, line: { color: BORDER_GRAY, width: 0.5 },
        });

        // Color the status cell based on value
        let textColor = BLACK;
        if (cIdx === 2) {
          const lower = (cellText || '').toLowerCase();
          if (lower === 'completed' || lower === 'done') textColor = '00B050';
          else if (lower.includes('progress')) textColor = 'FFC000';
          else if (lower.includes('not started')) textColor = 'FF0000';
        }

        s1.addText(cellText, {
          x: colX, y: yPos, w: msColWidths[cIdx], h: 0.42,
          fontSize: 7, color: textColor, fontFace: 'Arial', align: 'center', valign: 'middle',
          bold: cIdx === 2,
        });
        colX += msColWidths[cIdx];
      });
    });

    // Obstacles section
    const obstacleY = 5.6;
    s1.addText('What are the obstacles that SteerCo/ExCo need to help overcome to execute successfully?', {
      x: 0.2, y: obstacleY, w: 12.9, h: 0.25,
      fontSize: 8, bold: true, color: BLACK, fontFace: 'Arial',
    });
    s1.addText(form.obstacles || '', {
      x: 0.3, y: obstacleY + 0.3, w: 12.7, h: 0.6,
      fontSize: 8, color: '333333', fontFace: 'Arial', valign: 'top',
    });

    // RAG Legend
    const legendY = 6.6;
    s1.addText('RAG Legend:', { x: 0.2, y: legendY, w: 1.0, h: 0.25, fontSize: 7, bold: true, color: BLACK, fontFace: 'Arial' });
    const legends = [
      { label: 'Off Track/High Risk', color: RED, x: 1.5 },
      { label: 'Behind Schedule/Low Medium Risk', color: 'FFC000', x: 3.8 },
      { label: 'On Track/Low Risk', color: '00B050', x: 7.0 },
      { label: 'Completed', color: '0070C0', x: 9.0 },
      { label: 'Not started', color: 'A6A6A6', x: 10.7 },
    ];
    legends.forEach(l => {
      s1.addShape(pptx.ShapeType.rect, { x: l.x, y: legendY + 0.05, w: 0.2, h: 0.15, fill: { color: l.color } });
      s1.addText(l.label, { x: l.x + 0.25, y: legendY, w: 2.0, h: 0.25, fontSize: 6, color: BLACK, fontFace: 'Arial' });
    });

    // Footer - VOIS branding
    s1.addText('VOIS', {
      x: 11.0, y: 6.9, w: 2.0, h: 0.4,
      fontSize: 22, bold: true, color: DARK_RED, fontFace: 'Arial', align: 'right',
    });

    /* ──────────── SLIDE 2: Milestones Plan ──────────── */
    const s2 = pptx.addSlide();
    s2.background = { color: WHITE };

    s2.addText(`${form.projectName || 'Project Name'}| Milestones Plan`, {
      x: 0.2, y: 0.2, w: 8.0, h: 0.5,
      fontSize: 18, bold: true, color: BLACK, fontFace: 'Arial',
    });

    // RAG legend (top right)
    s2.addText('RAG Legend:', { x: 10.0, y: 0.2, w: 1.0, h: 0.2, fontSize: 7, bold: true, color: BLACK, fontFace: 'Arial' });
    const ragLegendItems = [
      { label: 'Critical Risk', color: RED },
      { label: 'On Track', color: '00B050' },
      { label: 'Behind/Risk', color: 'FFC000' },
      { label: 'Off Track', color: 'A6A6A6' },
    ];
    ragLegendItems.forEach((item, i) => {
      s2.addShape(pptx.ShapeType.rect, { x: 11.0 + (i > 1 ? -1.0 : 0), y: 0.45 + (i > 1 ? 0.2 : 0) + (i % 2 === 1 ? 0.2 : 0), w: 0.15, h: 0.15, fill: { color: item.color } });
      s2.addText(item.label, { x: 11.2 + (i > 1 ? -1.0 : 0), y: 0.42 + (i > 1 ? 0.2 : 0) + (i % 2 === 1 ? 0.2 : 0), w: 1.5, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });
    });

    // Milestone swim lanes
    form.milestones.forEach((ms, idx) => {
      const laneY = 1.2 + idx * 1.1;

      // Milestone label (red box)
      s2.addShape(pptx.ShapeType.roundRect, {
        x: 0.3, y: laneY, w: 1.8, h: 0.55,
        fill: { color: DARK_RED }, rectRadius: 0.05,
      });
      s2.addText(`Milestone${idx + 1}\n"${ms.name || '...'}"`, {
        x: 0.3, y: laneY, w: 1.8, h: 0.55,
        fontSize: 7, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle',
      });

      // Timeline bar
      const barColor = ms.status?.toLowerCase().includes('completed') || ms.status?.toLowerCase() === 'done'
        ? '00B050'
        : ms.status?.toLowerCase().includes('progress')
          ? 'FFC000'
          : 'A6A6A6';
      s2.addShape(pptx.ShapeType.rect, {
        x: 2.5, y: laneY + 0.15, w: 6.0, h: 0.25,
        fill: { color: barColor },
      });

      // Diamond marker at target date position
      s2.addShape(pptx.ShapeType.rect, {
        x: 8.2, y: laneY + 0.1, w: 0.15, h: 0.15,
        fill: { color: '0070C0' }, rotate: 45,
      });

      // Target date label
      if (ms.targetedDate) {
        s2.addText(ms.targetedDate, {
          x: 8.5, y: laneY + 0.05, w: 1.5, h: 0.25,
          fontSize: 7, color: BLACK, fontFace: 'Arial',
        });
      }
    });

    // Plan Assumptions
    const assY = 1.2 + form.milestones.length * 1.1 + 0.3;
    s2.addText('Plan Assumptions:', {
      x: 0.3, y: assY, w: 12.0, h: 0.25,
      fontSize: 9, bold: true, underline: { style: 'sng' }, color: BLACK, fontFace: 'Arial',
    });
    const assLines = (form.planAssumptions || '').split('\n').filter(Boolean);
    const assRuns = assLines.map(line => ({
      text: `• ${line}\n`,
      options: { fontSize: 7, color: '333333' as string, fontFace: 'Arial' as const },
    }));
    if (assRuns.length > 0) {
      s2.addText(assRuns, { x: 0.5, y: assY + 0.3, w: 11.5, h: 1.5, valign: 'top', lineSpacing: 13 });
    }

    /* ── save ── */
    pptx.writeFile({ fileName: `${form.projectName || 'POAP'}_StatusReport.pptx` });
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileSliders size={20} style={{ color: 'var(--color-cyan)' }} />
          <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Fill in all the POAP fields below and click "Make as Slide" to generate a PowerPoint.
          </span>
        </div>
        <button className="cyber-button" onClick={generateSlide} style={{ fontSize: '0.85rem' }}>
          <FileDown size={16} />
          Make as Slide
        </button>
      </div>

      {/* ── Section 1: Header Fields ── */}
      <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1.25rem' }}>
        <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.8rem', padding: '0 0.5rem', fontWeight: 700 }}>
          Project Header
        </legend>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="form-group">
            <label>Project Name / Title</label>
            <input className="cyber-input" value={form.projectName} onChange={e => set('projectName', e.target.value)} placeholder="e.g. VOIS Support" />
          </div>
          <div className="form-group">
            <label>REQ ID</label>
            <input className="cyber-input" value={form.reqId} onChange={e => set('reqId', e.target.value)} placeholder="e.g. 883471" />
          </div>
          <div className="form-group">
            <label>Project Manager</label>
            <input className="cyber-input" value={form.projectManager} onChange={e => set('projectManager', e.target.value)} placeholder="e.g. Amr Sono" />
          </div>
          <div className="form-group">
            <label>Expected Closure</label>
            <input className="cyber-input" type="date" value={form.expectedClosure} onChange={e => set('expectedClosure', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Portfolio</label>
            <input className="cyber-input" value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="e.g. Transition" />
          </div>
          <div className="form-group">
            <label>Transition</label>
            <input className="cyber-input" value={form.transition} onChange={e => set('transition', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Overall RAG</label>
            <select className="cyber-input" value={form.ragOverall} onChange={e => set('ragOverall', e.target.value as any)}>
              <option value="Green">Green</option>
              <option value="Amber">Amber</option>
              <option value="Red">Red</option>
            </select>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: '1rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="form-group">
            <label>MP Gate</label>
            <input className="cyber-input" value={form.mpGate} onChange={e => set('mpGate', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Build</label>
            <input className="cyber-input" value={form.build} onChange={e => set('build', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Project Gate</label>
            <input className="cyber-input" value={form.projectGate} onChange={e => set('projectGate', e.target.value)} />
          </div>
        </div>
      </fieldset>

      {/* ── Section 2: Scope & Status ── */}
      <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1.25rem' }}>
        <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.8rem', padding: '0 0.5rem', fontWeight: 700 }}>
          Scope & Status
        </legend>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label>Project Scope (one item per line, numbered automatically)</label>
            <textarea
              className="cyber-input"
              rows={6}
              value={form.projectScope}
              onChange={e => set('projectScope', e.target.value)}
              placeholder="Define and authorize the project kick-off...&#10;Establish the scope, objectives...&#10;The execution (building + hiring)..."
              style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
            />
          </div>
          <div className="form-group">
            <label>Current Status (one bullet per line)</label>
            <textarea
              className="cyber-input"
              rows={6}
              value={form.currentStatus}
              onChange={e => set('currentStatus', e.target.value)}
              placeholder="Building the mall and finishing it&#10;Finalize areas and split them..."
              style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Section 3: Milestones ── */}
      <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1.25rem' }}>
        <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.8rem', padding: '0 0.5rem', fontWeight: 700 }}>
          Project Milestones
        </legend>
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Milestone Name</th>
                <th>Status</th>
                <th>Targeted Date</th>
                <th>Release Date</th>
                <th>Actual Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {form.milestones.map((ms, idx) => (
                <tr key={ms.id}>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                  <td>
                    <input className="cyber-input" style={{ width: '100%' }} value={ms.name}
                      onChange={e => setMilestone(idx, 'name', e.target.value)}
                      placeholder="e.g. Land acquisition" />
                  </td>
                  <td>
                    <select className="cyber-input" style={{ width: '100%' }} value={ms.status}
                      onChange={e => setMilestone(idx, 'status', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <input className="cyber-input" type="date" style={{ width: '100%' }} value={ms.targetedDate}
                      onChange={e => setMilestone(idx, 'targetedDate', e.target.value)} />
                  </td>
                  <td>
                    <input className="cyber-input" type="date" style={{ width: '100%' }} value={ms.releaseDate}
                      onChange={e => setMilestone(idx, 'releaseDate', e.target.value)} />
                  </td>
                  <td>
                    <input className="cyber-input" type="date" style={{ width: '100%' }} value={ms.actualDate}
                      onChange={e => setMilestone(idx, 'actualDate', e.target.value)} />
                  </td>
                  <td>
                    <button className="icon-button" onClick={() => removeMilestone(idx)} title="Remove milestone"
                      style={{ opacity: form.milestones.length <= 1 ? 0.3 : 1 }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="cyber-button secondary" onClick={addMilestone} style={{ marginTop: '0.75rem' }}>
          <Plus size={14} /> Add Milestone
        </button>
      </fieldset>

      {/* ── Section 4: Obstacles & Assumptions ── */}
      <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1.25rem' }}>
        <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.8rem', padding: '0 0.5rem', fontWeight: 700 }}>
          Obstacles & Assumptions
        </legend>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label>SteerCo/ExCo Obstacles</label>
            <textarea
              className="cyber-input"
              rows={4}
              value={form.obstacles}
              onChange={e => set('obstacles', e.target.value)}
              placeholder="What are the obstacles that SteerCo/ExCo need to help overcome?"
              style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
            />
          </div>
          <div className="form-group">
            <label>Plan Assumptions (one per line, for Milestones Plan slide)</label>
            <textarea
              className="cyber-input"
              rows={4}
              value={form.planAssumptions}
              onChange={e => set('planAssumptions', e.target.value)}
              placeholder="Continuous sales guarantees cash flow...&#10;Setting up deadline for shop owners..."
              style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
            />
          </div>
        </div>
      </fieldset>

      {/* Bottom CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}>
        <button className="cyber-button" onClick={generateSlide} style={{ padding: '0.75rem 2.5rem', fontSize: '1rem' }}>
          <FileDown size={18} />
          Make as Slide
        </button>
      </div>
    </div>
  );
}
