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
  Presentation,
  LayoutTemplate,
  Settings as SettingsIcon,
  SlidersHorizontal,
  ClipboardList,
  BookOpen
} from 'lucide-react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { FunnelReviewing } from './views/FunnelReviewing';
import { Analysing } from './views/Analysing';
import { ImplementingBuild } from './views/ImplementingBuild';
import { FinancesApprovals } from './views/FinancesApprovals';
import { TestingQuality } from './views/TestingQuality';
import { ReleaseGovernance } from './views/ReleaseGovernance';
import { PostLaunchELS } from './views/PostLaunchELS';
import { POAP } from './views/POAP';
import { Settings as SettingsView, ThemeMode } from './views/Settings';
import { POAPSlideBuilder } from './views/POAPSlideBuilder';
import { ReleasePlanningMeeting } from './views/ReleasePlanningMeeting';
import { WalkthroughWizard } from './views/WalkthroughWizard';
import { exportToExcel } from './utils/excelExporter';
import { exportToPPT } from './utils/pptxExporter';
import {
  initialFinancials,
  initialADOWorkItems,
  initialSquads,
  initialMilestones,
  initialAllocations,
  initialForecastMonths,
  initialTransfers,
  initialQAGates,
  initialDefects,
  initialRisks,
  initialChecklist,
  initialHypercare,
  initialPOAPData,
  ProjectFinancials,
  ADOWorkItem,
  PortfolioSquad,
  Milestone,
  FinancialAllocation,
  FundTransfer,
  QAGate,
  Defect,
  RiskIssue,
  ChecklistItem,
  HypercareTicket,
  POAPData,
  GovernanceGateDetail,
  initialGovernanceGates,
  PIWizardData,
  initialPIWizardData
} from './utils/mockData';

type PhaseId = 'funnel' | 'analysing' | 'build' | 'finances' | 'testing' | 'releaseplanning' | 'walkthrough' | 'governance' | 'postlaunch' | 'poap' | 'slidebuilder' | 'settings';

interface PhaseMetadata {
  id: PhaseId;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function App() {
  const [activePhase, setActivePhase] = useState<PhaseId>('funnel');
  const [theme, setTheme] = useState<ThemeMode>('dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Shared Data States
  const [financials, setFinancials] = useState<ProjectFinancials>(initialFinancials);
  const [adoWorkItems, setAdoWorkItems] = useState<ADOWorkItem[]>(initialADOWorkItems);
  const [squads, setSquads] = useState<PortfolioSquad[]>(initialSquads);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [allocations, setAllocations] = useState<FinancialAllocation[]>(initialAllocations);
  const [transfers, setTransfers] = useState<FundTransfer[]>(initialTransfers);
  const [forecastMonths] = useState(initialForecastMonths);
  const [qaGates, setQaGates] = useState<QAGate[]>(initialQAGates);
  const [defects, setDefects] = useState<Defect[]>(initialDefects);
  const [risks, setRisks] = useState<RiskIssue[]>(initialRisks);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [hypercare, setHypercare] = useState<HypercareTicket[]>(initialHypercare);
  const [poapData, setPoapData] = useState<POAPData>(initialPOAPData);
  const [governanceGates, setGovernanceGates] = useState<GovernanceGateDetail[]>(initialGovernanceGates);
  const [piWizardData, setPiWizardData] = useState<PIWizardData>(initialPIWizardData);
  
  const [ragStatus, setRagStatus] = useState({
    schedule: 'Green',
    budget: 'Amber',
    scope: 'Green',
    quality: 'Green',
    overall: 'Amber'
  });

  const phases: PhaseMetadata[] = [
    { id: 'funnel', name: 'Funnel & Reviewing', icon: FolderOpen, color: 'var(--color-green)' },
    { id: 'analysing', name: 'Analysing & PI Readiness', icon: Compass, color: 'var(--color-cyan)' },
    { id: 'finances', name: 'Finances & Approvals', icon: CircleDollarSign, color: 'var(--color-amber)' },
    { id: 'build', name: 'Implementing & Build', icon: Wrench, color: 'var(--color-purple)' },
    { id: 'testing', name: 'Testing & Quality', icon: Bug, color: 'var(--color-magenta)' },
    { id: 'releaseplanning', name: 'Release Planning & Gates', icon: ClipboardList, color: '#ef4444' },
    { id: 'walkthrough', name: 'Walkthrough Wizard', icon: BookOpen, color: '#e60000' },
    { id: 'governance', name: 'Release & Governance', icon: Scale, color: '#60a5fa' },
    { id: 'postlaunch', name: 'Go-Live & ELS', icon: ShieldCheck, color: '#a855f7' },
    { id: 'poap', name: 'Digital POAP', icon: LayoutTemplate, color: '#2dd4bf' },
    { id: 'slidebuilder', name: 'POAP Slide Builder', icon: SlidersHorizontal, color: '#f472b6' },
    { id: 'settings', name: 'Settings', icon: SettingsIcon, color: '#94a3b8' }
  ];

  const activeMetadata = useMemo(() => {
    return phases.find(p => p.id === activePhase) || phases[0];
  }, [activePhase]);

  // Calculated HUD stats
  const budgetProgressPercent = useMemo(() => {
    const limit = financials.capexLimit + financials.opexLimit;
    return Math.min(100, Math.round((financials.totalSpent / limit) * 100));
  }, [financials]);

  const sitProgressPercent = useMemo(() => {
    const sit = qaGates.find(q => q.name === 'SIT');
    if (!sit || sit.totalTests === 0) return 0;
    return Math.round((sit.passed / sit.totalTests) * 100);
  }, [qaGates]);

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

  const renameSquad = (id: string, newName: string) => {
    if (!newName.trim()) return;

    const squadToRename = squads.find(s => s.id === id);
    if (!squadToRename) return;
    const oldName = squadToRename.name;
    if (oldName === newName) return;

    // 1. Update squads name
    setSquads(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));

    // 2. Update allocations squadName
    setAllocations(prev => prev.map(a => a.squadId === id ? { ...a, squadName: newName } : a));

    // 3. Update transfers fromSquad / toSquad names
    setTransfers(prev => prev.map(t => {
      let updated = { ...t };
      if (t.fromSquad === oldName) updated.fromSquad = newName;
      if (t.toSquad === oldName) updated.toSquad = newName;
      return updated;
    }));

    // 4. Update defects squad name
    setDefects(prev => prev.map(d => d.squad === oldName ? { ...d, squad: newName } : d));
  };

  const renderActiveView = () => {
    switch (activePhase) {
      case 'funnel':
        return <FunnelReviewing financials={financials} setFinancials={setFinancials} />;
      case 'analysing':
        return (
          <Analysing 
            adoWorkItems={adoWorkItems} 
            setAdoWorkItems={setAdoWorkItems} 
            squads={squads} 
            renameSquad={renameSquad} 
          />
        );
      case 'finances':
        return (
          <FinancesApprovals 
            financials={financials}
            setFinancials={setFinancials}
            allocations={allocations} 
            setAllocations={setAllocations} 
            transfers={transfers} 
            setTransfers={setTransfers} 
            forecastMonths={forecastMonths} 
          />
        );
      case 'build':
        return (
          <ImplementingBuild 
            squads={squads} 
            setSquads={setSquads} 
            milestones={milestones} 
            setMilestones={setMilestones} 
          />
        );
      case 'testing':
        return (
          <TestingQuality 
            qaGates={qaGates} 
            setQaGates={setQaGates} 
            defects={defects} 
            setDefects={setDefects} 
            squads={squads} 
          />
        );
      case 'governance':
        return (
          <ReleaseGovernance 
            risks={risks} 
            setRisks={setRisks} 
            ragStatus={ragStatus} 
            setRagStatus={setRagStatus} 
            financials={financials} 
            squads={squads} 
            defects={defects}
            checklist={checklist}
            setChecklist={setChecklist}
          />
        );
      case 'postlaunch':
        return (
          <PostLaunchELS 
            hypercare={hypercare} 
            setHypercare={setHypercare} 
          />
        );
      case 'poap':
        return (
          <POAP 
            poapData={poapData}
            setPoapData={setPoapData}
            ragStatus={ragStatus}
          />
        );
      case 'releaseplanning':
        return (
          <ReleasePlanningMeeting 
            gates={governanceGates}
            setGates={setGovernanceGates}
          />
        );
      case 'walkthrough':
        return <WalkthroughWizard />;
      case 'slidebuilder':
        return <POAPSlideBuilder />;
      case 'settings':
        return <SettingsView theme={theme} setTheme={setTheme} />;
      default:
        return <FunnelReviewing financials={financials} setFinancials={setFinancials} />;
    }
  };

  const handleExcelExport = () => {
    exportToExcel(
      financials,
      adoWorkItems,
      squads,
      allocations,
      transfers,
      qaGates,
      defects,
      risks
    );
  };

  const handlePPTExport = () => {
    exportToPPT(
      financials,
      adoWorkItems,
      squads,
      allocations,
      qaGates,
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
              <span className="hud-stat-label">Project / Increment</span>
              <span className="hud-stat-value mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
                PRJ-VELOCITY (PI40)
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
                <span className="hud-stat-label">Budget vs Actuals</span>
                <span className="hud-stat-value mono">
                  ${(financials.totalSpent / 1000000).toFixed(2)}M / ${( (financials.capexLimit + financials.opexLimit) / 1000000 ).toFixed(2)}M ({budgetProgressPercent}%)
                </span>
              </div>

              <div className="hud-stat">
                <span className="hud-stat-label">SIT Pass Rate</span>
                <span className="hud-stat-value mono" style={{ color: sitProgressPercent > 70 ? 'var(--color-green)' : 'var(--color-amber)' }}>
                  {sitProgressPercent}%
                </span>
              </div>

              <div className="hud-stat">
                <span className="hud-stat-label">Governance Readiness</span>
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
