import React, { useState, useEffect } from 'react';
import { GovernanceGateDetail, RPMParticipantRow, initialGovernanceGates } from '../utils/mockData';
import { exportGovernanceGatesToPPT } from '../utils/pptxExporter';
import { Presentation, Download, RefreshCw, FileText, Eye, LayoutGrid } from 'lucide-react';
import { GateSlidePreview } from '../components/planning/GateSlidePreview';
import { GateEditorForm } from '../components/planning/GateEditorForm';
import './ReleasePlanningMeeting.css';

interface ReleasePlanningMeetingProps {
  gates: GovernanceGateDetail[];
  setGates: React.Dispatch<React.SetStateAction<GovernanceGateDetail[]>>;
}

type ViewMode = 'split' | 'edit' | 'preview';

export function ReleasePlanningMeeting({ gates, setGates }: ReleasePlanningMeetingProps) {
  const [activeGateId, setActiveGateId] = useState<string>('rpm');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && viewMode === 'split') {
        setViewMode('edit');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const activeGate = gates.find(g => g.id === activeGateId) || gates[0];

  const updateGateField = (field: keyof GovernanceGateDetail, value: string | string[] | RPMParticipantRow[]) => {
    setGates(prevGates => prevGates.map(g => {
      if (g.id === activeGateId) {
        return { ...g, [field]: value };
      }
      return g;
    }));
  };

  const updateParticipantField = (rowIndex: number, field: keyof RPMParticipantRow, value: string | string[]) => {
    setGates(prevGates => prevGates.map(g => {
      if (g.id === activeGateId) {
        const updatedParticipants = g.participants.map((p, idx) => {
          if (idx === rowIndex) {
            return { ...p, [field]: value };
          }
          return p;
        });
        return { ...g, participants: updatedParticipants };
      }
      return g;
    }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all governance gate data to defaults?')) {
      const defaultGate = initialGovernanceGates.find(g => g.id === activeGateId);
      if (defaultGate) {
        setGates(prevGates => prevGates.map(g => {
          if (g.id === activeGateId) {
            return JSON.parse(JSON.stringify(defaultGate));
          }
          return g;
        }));
      }
    }
  };

  const handleExportSingle = () => {
    exportGovernanceGatesToPPT(gates, activeGateId);
  };

  const handleExportAll = () => {
    exportGovernanceGatesToPPT(gates);
  };

  return (
    <div className="governance-gates-view">
      <div className="gates-header-actions">
        <div className="gate-tabs">
          {gates.map(g => (
            <button
              key={g.id}
              className={`gate-tab-btn ${activeGateId === g.id ? 'active' : ''}`}
              onClick={() => setActiveGateId(g.id)}
            >
              {g.id === 'rpm' ? 'RPM' : g.id === 'cp1' ? 'Checkpoint 1' : g.id === 'cp2' ? 'Checkpoint 2' : 'Change Requests'}
            </button>
          ))}
        </div>

        <div className="view-controls">
          <button
            className={`view-mode-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            <LayoutGrid size={14} />
            <span>Split Screen</span>
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'edit' ? 'active' : ''}`}
            onClick={() => setViewMode('edit')}
          >
            <FileText size={14} />
            <span>Editor Only</span>
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
          >
            <Eye size={14} />
            <span>Slide Preview</span>
          </button>
        </div>

        <div className="view-action-buttons">
          <button className="cyber-button" onClick={handleExportSingle} title="Export current slide as PPTX">
            <Download size={14} />
            <span className="cyber-btn-text">Export Active Slide</span>
          </button>
          <button className="cyber-button secondary" onClick={handleExportAll} title="Export all 4 governance slides as a PPTX deck">
            <Presentation size={14} />
            <span className="cyber-btn-text">Export Gate Deck</span>
          </button>
          <button className="cyber-button secondary" style={{ minWidth: '40px', padding: '0.5rem' }} onClick={handleReset} title="Reset slide to template defaults">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className={`gate-grid ${viewMode === 'split' ? 'split-mode' : ''}`}>
        {(viewMode === 'split' || viewMode === 'edit') && (
          <GateEditorForm
            activeGate={activeGate}
            onUpdateField={updateGateField}
            onUpdateParticipant={updateParticipantField}
          />
        )}

        {(viewMode === 'split' || viewMode === 'preview') && (
          <GateSlidePreview activeGate={activeGate} />
        )}
      </div>
    </div>
  );
}
