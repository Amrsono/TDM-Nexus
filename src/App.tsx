import React, { useState, useMemo } from 'react';
import { 
  FolderOpen, 
  Compass, 
  Wrench, 
  CircleDollarSign, 
  Bug, 
  Scale, 
  ShieldCheck, 
  FileSpreadsheet, 
  Presentation
} from 'lucide-react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Initiation } from './views/Initiation';
import { Analysis } from './views/Analysis';
import { BuildDelivery } from './views/BuildDelivery';
import { Finances } from './views/Finances';
import { Testing } from './views/Testing';
import { Governance } from './views/Governance';
import { Closure } from './views/Closure';
import { exportToExcel } from './utils/excelExporter';
import { exportToPPT } from './utils/pptxExporter';
import {
  initialFinancials,
  initialRequirements,
  initialDomains,
  initialMilestones,
  initialAllocations,
  initialForecastMonths,
  initialTransfers,
  initialQAStatus,
  initialDefects,
  initialRisks,
  initialChecklist,
  initialHypercare,
  ProjectFinancials,
  Requirement,
  DomainBuild,
  Milestone,
  FinancialAllocation,
  FundTransfer,
  QAStatus,
  Defect,
  RiskIssue,
  ChecklistItem,
  HypercareTicket
} from './utils/mockData';

type PhaseId = 'initiation' | 'analysis' | 'build' | 'finances' | 'testing' | 'governance' | 'closure';

interface PhaseMetadata {
  id: PhaseId;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function App() {
  const [activePhase, setActivePhase] = useState<PhaseId>('initiation');

  // Shared Data States
  const [financials, setFinancials] = useState<ProjectFinancials>(initialFinancials);
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements);
  const [domains, setDomains] = useState<DomainBuild[]>(initialDomains);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [allocations, setAllocations] = useState<FinancialAllocation[]>(initialAllocations);
  const [transfers, setTransfers] = useState<FundTransfer[]>(initialTransfers);
  const [forecastMonths] = useState(initialForecastMonths);
  const [qaStatus, setQaStatus] = useState<QAStatus>(initialQAStatus);
  const [defects, setDefects] = useState<Defect[]>(initialDefects);
  const [risks, setRisks] = useState<RiskIssue[]>(initialRisks);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [hypercare, setHypercare] = useState<HypercareTicket[]>(initialHypercare);
  
  const [ragStatus, setRagStatus] = useState({
    schedule: 'Green',
    budget: 'Amber',
    scope: 'Green',
    quality: 'Green',
    overall: 'Amber'
  });

  const phases: PhaseMetadata[] = [
    { id: 'initiation', name: 'Project Initiation', icon: FolderOpen, color: 'var(--color-green)' },
    { id: 'analysis', name: 'Project Analysis', icon: Compass, color: 'var(--color-cyan)' },
    { id: 'build', name: 'Build & Delivery', icon: Wrench, color: 'var(--color-purple)' },
    { id: 'finances', name: 'Finances & Budget', icon: CircleDollarSign, color: 'var(--color-amber)' },
    { id: 'testing', name: 'QA & Testing', icon: Bug, color: 'var(--color-magenta)' },
    { id: 'governance', name: 'Project Governance', icon: Scale, color: '#60a5fa' },
    { id: 'closure', name: 'Closure & Hypercare', icon: ShieldCheck, color: '#a855f7' }
  ];

  const activeMetadata = useMemo(() => {
    return phases.find(p => p.id === activePhase) || phases[0];
  }, [activePhase]);

  // Calculated HUD stats
  const budgetProgressPercent = useMemo(() => {
    const limit = financials.capexLimit + financials.opexLimit;
    return Math.min(100, Math.round((financials.totalSpent / limit) * 100));
  }, [financials]);

  const qaPassRatePercent = useMemo(() => {
    if (qaStatus.totalTests === 0) return 0;
    return Math.round((qaStatus.passed / qaStatus.totalTests) * 100);
  }, [qaStatus]);

  const checklistPercent = useMemo(() => {
    if (checklist.length === 0) return 0;
    const completed = checklist.filter(c => c.checked).length;
    return Math.round((completed / checklist.length) * 100);
  }, [checklist]);

  const handlePhaseSelect = (phaseId: string) => {
    if (phases.some(p => p.id === phaseId)) {
      setActivePhase(phaseId as PhaseId);
    }
  };

  const renameDomain = (id: string, newName: string) => {
    if (!newName.trim()) return;

    const domainToRename = domains.find(d => d.id === id);
    if (!domainToRename) return;
    const oldName = domainToRename.name;
    if (oldName === newName) return;

    // 1. Update domains name
    setDomains(prev => prev.map(d => d.id === id ? { ...d, name: newName } : d));

    // 2. Update requirements linked to this domain name
    setRequirements(prev => prev.map(r => r.domain === oldName ? { ...r, domain: newName } : r));

    // 3. Update allocations domainName
    setAllocations(prev => prev.map(a => a.domainId === id ? { ...a, domainName: newName } : a));

    // 4. Update transfers fromDomain / toDomain names
    setTransfers(prev => prev.map(t => {
      let updated = { ...t };
      if (t.fromDomain === oldName) updated.fromDomain = newName;
      if (t.toDomain === oldName) updated.toDomain = newName;
      return updated;
    }));

    // 5. Update defects domain name
    setDefects(prev => prev.map(d => d.domain === oldName ? { ...d, domain: newName } : d));
  };

  const renderActiveView = () => {
    switch (activePhase) {
      case 'initiation':
        return <Initiation financials={financials} setFinancials={setFinancials} />;
      case 'analysis':
        return (
          <Analysis 
            requirements={requirements} 
            setRequirements={setRequirements} 
            domains={domains} 
            renameDomain={renameDomain} 
          />
        );
      case 'build':
        return (
          <BuildDelivery 
            domains={domains} 
            setDomains={setDomains} 
            milestones={milestones} 
            setMilestones={setMilestones} 
          />
        );
      case 'finances':
        return (
          <Finances 
            allocations={allocations} 
            setAllocations={setAllocations} 
            transfers={transfers} 
            setTransfers={setTransfers} 
            forecastMonths={forecastMonths} 
          />
        );
      case 'testing':
        return (
          <Testing 
            qaStatus={qaStatus} 
            setQaStatus={setQaStatus} 
            defects={defects} 
            setDefects={setDefects} 
            domains={domains} 
          />
        );
      case 'governance':
        return (
          <Governance 
            risks={risks} 
            setRisks={setRisks} 
            ragStatus={ragStatus} 
            setRagStatus={setRagStatus} 
            financials={financials} 
            domains={domains} 
            defects={defects} 
          />
        );
      case 'closure':
        return (
          <Closure 
            checklist={checklist} 
            setChecklist={setChecklist} 
            hypercare={hypercare} 
            setHypercare={setHypercare} 
          />
        );
      default:
        return <Initiation financials={financials} setFinancials={setFinancials} />;
    }
  };

  const handleExcelExport = () => {
    exportToExcel(
      financials,
      requirements,
      domains,
      allocations,
      transfers,
      qaStatus,
      defects,
      risks
    );
  };

  const handlePPTExport = () => {
    exportToPPT(
      financials,
      requirements,
      domains,
      allocations,
      qaStatus,
      defects,
      risks,
      ragStatus
    );
  };

  return (
    <div className="dashboard-container">
      <div className="grid-bg-overlay"></div>
      <div className="scanlines-overlay"></div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            TDM <span>NEXUS</span>
          </div>
          <ul className="nav-list">
            {phases.map(p => {
              const Icon = p.icon;
              return (
                <li 
                  key={p.id} 
                  className={`nav-item ${activePhase === p.id ? 'active' : ''}`}
                  onClick={() => setActivePhase(p.id)}
                >
                  <Icon size={18} />
                  <span>{p.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sidebar Footer Info */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
          <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            PROJECT RAG STATUS
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', color: '#fff' }}>Overall Health:</span>
            <span className={`rag-badge ${ragStatus.overall.toLowerCase()}`}>
              {ragStatus.overall}
            </span>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="main-content">
        {/* Interactive 3D Canvas */}
        <div className="three-viewport-wrapper">
          <ThreeCanvas activePhase={activePhase} onPhaseSelect={handlePhaseSelect} />
        </div>

        {/* Front Panel HUD and Active View Card */}
        <div className="ui-overlay-container">
          {/* Top HUD Banner */}
          <header className="hud-banner glass-panel">
            <div className="hud-stat">
              <span className="hud-stat-label">Project Domain</span>
              <span className="hud-stat-value mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
                PROJECT VELOCITY
              </span>
            </div>

            <div className="hud-stat-group">
              <div className="hud-stat">
                <span className="hud-stat-label">Active Phase</span>
                <span className="hud-stat-value mono" style={{ color: activeMetadata.color }}>
                  {activeMetadata.name.toUpperCase()}
                </span>
              </div>

              <div className="hud-stat">
                <span className="hud-stat-label">Budget Spent</span>
                <span className="hud-stat-value mono">
                  ${(financials.totalSpent / 1000000).toFixed(2)}M / ${( (financials.capexLimit + financials.opexLimit) / 1000000 ).toFixed(2)}M ({budgetProgressPercent}%)
                </span>
              </div>

              <div className="hud-stat">
                <span className="hud-stat-label">QA Pass Rate</span>
                <span className="hud-stat-value mono" style={{ color: qaPassRatePercent > 70 ? 'var(--color-green)' : 'var(--color-amber)' }}>
                  {qaPassRatePercent}%
                </span>
              </div>

              <div className="hud-stat">
                <span className="hud-stat-label">Checklist Readiness</span>
                <span className="hud-stat-value mono">
                  {checklistPercent}%
                </span>
              </div>
            </div>
          </header>

          {/* Active View Module */}
          <div className="active-view-overlay glass-panel">
            <div className="view-header">
              <div className="view-title">
                {React.createElement(activeMetadata.icon, { size: 22, className: 'mono', style: { color: activeMetadata.color } })}
                <h2 className="mono" style={{ textTransform: 'uppercase' }}>{activeMetadata.name}</h2>
              </div>
              
              {/* Excel and PPT Exporters */}
              <div style={{ display: 'flex', gap: '0.75rem', pointerEvents: 'auto' }}>
                <button className="cyber-button" onClick={handleExcelExport} title="Export project details, finances, NFRs to Excel">
                  <FileSpreadsheet size={16} />
                  <span>Export Excel</span>
                </button>
                <button className="cyber-button secondary" onClick={handlePPTExport} title="Export SteerCo Steering Committee PPT deck">
                  <Presentation size={16} />
                  <span>Export PPT</span>
                </button>
              </div>
            </div>
            
            <div className="view-body">
              {renderActiveView()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
