import React, { useState, useReducer, useMemo } from 'react';
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
  BookOpen,
  Menu,
  X,
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
import { useAIAssistant } from './context/AIAssistantContext';
import { AIAssistantApplet } from './components/AIAssistantApplet';
import { generateReportAnalytics } from './utils/aiService';
import { projectReducer, initialRootProjectState } from './store/projectReducer';

export type PhaseId =
  | 'funnel'
  | 'analysing'
  | 'build'
  | 'finances'
  | 'testing'
  | 'releaseplanning'
  | 'walkthrough'
  | 'governance'
  | 'postlaunch'
  | 'poap'
  | 'slidebuilder'
  | 'settings';

interface PhaseMetadata {
  id: PhaseId;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function App() {
  const { setProjectState, settings, projectState } = useAIAssistant();
  const [activePhase, setActivePhase] = useState<PhaseId>('funnel');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Centralized State Store via useReducer
  const [state, dispatch] = useReducer(projectReducer, initialRootProjectState);

  const {
    financials,
    adoWorkItems,
    squads,
    milestones,
    allocations,
    transfers,
    forecastMonths,
    qaGates,
    defects,
    risks,
    checklist,
    hypercare,
    poapData,
    governanceGates,
    piWizardData,
    walkthroughData,
    ragStatus,
  } = state;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    { id: 'settings', name: 'Settings', icon: SettingsIcon, color: '#94a3b8' },
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

  React.useEffect(() => {
    setProjectState({
      financials,
      adoWorkItems,
      squads,
      milestones,
      allocations,
      transfers,
      forecastMonths,
      qaGates,
      defects,
      risks,
      checklist,
      hypercare,
      poapData,
      governanceGates,
      piWizardData,
      walkthroughData,
      ragStatus,
      budgetProgressPercent,
      sitProgressPercent,
      checklistPercent,
    });
  }, [
    financials,
    adoWorkItems,
    squads,
    milestones,
    allocations,
    transfers,
    forecastMonths,
    qaGates,
    defects,
    risks,
    checklist,
    hypercare,
    poapData,
    governanceGates,
    piWizardData,
    walkthroughData,
    ragStatus,
    budgetProgressPercent,
    sitProgressPercent,
    checklistPercent,
    setProjectState,
  ]);

  const handlePhaseSelect = (phaseId: string) => {
    if (phases.some(p => p.id === phaseId)) {
      setActivePhase(phaseId as PhaseId);
      setSidebarOpen(false);
    }
  };

  const renameSquad = (id: string, newName: string) => {
    const s = squads.find(x => x.id === id);
    if (s) {
      dispatch({ type: 'UPDATE_SQUAD_NAME', payload: { id, oldName: s.name, newName } });
    }
  };

  const deleteSquad = (id: string) => {
    const s = squads.find(x => x.id === id);
    if (!s) return;
    const oldName = s.name;
    dispatch({ type: 'SET_SQUADS', payload: prev => prev.filter(item => item.id !== id) });
    dispatch({ type: 'SET_ALLOCATIONS', payload: prev => prev.filter(a => a.squadId !== id) });
    dispatch({ type: 'SET_TRANSFERS', payload: prev => prev.filter(t => t.fromSquad !== oldName && t.toSquad !== oldName) });
    dispatch({ type: 'SET_DEFECTS', payload: prev => prev.map(d => (d.squad === oldName ? { ...d, squad: 'Unassigned' } : d)) });
    dispatch({ type: 'SET_ADO_WORK_ITEMS', payload: prev => prev.map(a => (a.portfolio === oldName ? { ...a, portfolio: 'Unassigned' } : a)) });
  };

  const clearAllSquads = () => {
    dispatch({ type: 'SET_SQUADS', payload: [] });
    dispatch({ type: 'SET_ALLOCATIONS', payload: [] });
    dispatch({ type: 'SET_TRANSFERS', payload: [] });
    dispatch({ type: 'SET_DEFECTS', payload: prev => prev.map(d => ({ ...d, squad: 'Unassigned' })) });
    dispatch({ type: 'SET_ADO_WORK_ITEMS', payload: prev => prev.map(a => ({ ...a, portfolio: 'Unassigned' })) });
  };

  const renderActiveView = () => {
    switch (activePhase) {
      case 'funnel':
        return <FunnelReviewing financials={financials} setFinancials={payload => dispatch({ type: 'SET_FINANCIALS', payload })} />;
      case 'analysing':
        return (
          <Analysing
            adoWorkItems={adoWorkItems}
            setAdoWorkItems={payload => dispatch({ type: 'SET_ADO_WORK_ITEMS', payload })}
            squads={squads}
            setSquads={payload => dispatch({ type: 'SET_SQUADS', payload })}
            renameSquad={renameSquad}
            deleteSquad={deleteSquad}
            clearAllSquads={clearAllSquads}
          />
        );
      case 'finances':
        return (
          <FinancesApprovals
            financials={financials}
            setFinancials={payload => dispatch({ type: 'SET_FINANCIALS', payload })}
            allocations={allocations}
            setAllocations={payload => dispatch({ type: 'SET_ALLOCATIONS', payload })}
            transfers={transfers}
            setTransfers={payload => dispatch({ type: 'SET_TRANSFERS', payload })}
            forecastMonths={forecastMonths}
          />
        );
      case 'build':
        return (
          <ImplementingBuild
            squads={squads}
            setSquads={payload => dispatch({ type: 'SET_SQUADS', payload })}
            milestones={milestones}
            setMilestones={payload => dispatch({ type: 'SET_MILESTONES', payload })}
          />
        );
      case 'testing':
        return (
          <TestingQuality
            qaGates={qaGates}
            setQaGates={payload => dispatch({ type: 'SET_QA_GATES', payload })}
            defects={defects}
            setDefects={payload => dispatch({ type: 'SET_DEFECTS', payload })}
            squads={squads}
          />
        );
      case 'governance':
        return (
          <ReleaseGovernance
            risks={risks}
            setRisks={payload => dispatch({ type: 'SET_RISKS', payload })}
            ragStatus={ragStatus}
            setRagStatus={(payload: typeof ragStatus | ((prev: typeof ragStatus) => typeof ragStatus)) => dispatch({ type: 'SET_RAG_STATUS', payload: payload as any })}
            financials={financials}
            squads={squads}
            defects={defects}
            checklist={checklist}
            setChecklist={payload => dispatch({ type: 'SET_CHECKLIST', payload })}
          />
        );
      case 'postlaunch':
        return (
          <PostLaunchELS
            hypercare={hypercare}
            setHypercare={payload => dispatch({ type: 'SET_HYPERCARE', payload })}
          />
        );
      case 'poap':
        return (
          <POAP
            poapData={poapData}
            setPoapData={payload => dispatch({ type: 'SET_POAP_DATA', payload })}
            ragStatus={ragStatus}
          />
        );
      case 'releaseplanning':
        return (
          <ReleasePlanningMeeting
            gates={governanceGates}
            setGates={payload => dispatch({ type: 'SET_GOVERNANCE_GATES', payload })}
          />
        );
      case 'walkthrough':
        return (
          <WalkthroughWizard
            data={walkthroughData}
            setData={payload => dispatch({ type: 'SET_WALKTHROUGH_DATA', payload })}
          />
        );
      case 'slidebuilder':
        return <POAPSlideBuilder />;
      case 'settings':
        return <SettingsView theme={theme} setTheme={setTheme} />;
      default:
        return <FunnelReviewing financials={financials} setFinancials={payload => dispatch({ type: 'SET_FINANCIALS', payload })} />;
    }
  };

  const handleExcelExport = async () => {
    let aiAnalysis = 'Offline Analysis: No AI configured.';
    if (projectState && settings.enabled) {
      aiAnalysis = await generateReportAnalytics(projectState, 'excel', settings);
    }

    exportToExcel(
      financials,
      adoWorkItems,
      squads,
      allocations,
      transfers,
      qaGates,
      defects,
      risks,
      aiAnalysis
    );
  };

  const handlePPTExport = async () => {
    let aiAnalysis = 'Offline Analysis: No AI configured.';
    if (projectState && settings.enabled) {
      aiAnalysis = await generateReportAnalytics(projectState, 'ppt', settings);
    }

    exportToPPT(
      financials,
      adoWorkItems,
      squads,
      allocations,
      qaGates,
      defects,
      risks,
      ragStatus,
      aiAnalysis
    );
  };

  return (
    <div className="layout-container">
      <header className="header">
        <div className="header-left">
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="logo-group">
            <span className="logo-icon">TDM</span>
            <div className="logo-text">
              <h1>NEXUS</h1>
              <span>Enterprise Delivery Architecture</span>
            </div>
          </div>
        </div>

        <div className="hud-metrics">
          <div className="hud-metric">
            <span className="metric-label">Overall RAG</span>
            <span className={`metric-value rag-${ragStatus.overall.toLowerCase()}`}>
              {ragStatus.overall}
            </span>
          </div>
          <div className="hud-metric">
            <span className="metric-label">Budget Burn</span>
            <span className="metric-value">{budgetProgressPercent}%</span>
          </div>
          <div className="hud-metric">
            <span className="metric-label">SIT Pass</span>
            <span className="metric-value">{sitProgressPercent}%</span>
          </div>
          <div className="hud-metric">
            <span className="metric-label">Gate Progress</span>
            <span className="metric-value">{checklistPercent}%</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExcelExport}>
            <FileSpreadsheet size={16} />
            <span>Excel Export</span>
          </button>
          <button className="btn btn-primary" onClick={handlePPTExport}>
            <Presentation size={16} />
            <span>PPT Export</span>
          </button>
        </div>
      </header>

      <div className="main-layout">
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <nav className="nav-list">
            {phases.map(p => {
              const Icon = p.icon;
              const isActive = activePhase === p.id;
              return (
                <button
                  key={p.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handlePhaseSelect(p.id)}
                >
                  <Icon size={18} style={{ color: p.color }} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="content-area">
          {activePhase !== 'settings' && activePhase !== 'slidebuilder' && (
            <div className="canvas-wrapper">
              <ThreeCanvas activePhase={activePhase} onPhaseSelect={handlePhaseSelect} />
            </div>
          )}

          <div className="view-container">
            <div className="view-header">
              <h2>{activeMetadata.name}</h2>
            </div>
            {renderActiveView()}
          </div>
        </main>
      </div>

      <AIAssistantApplet activePhase={activePhase} onNavigateToSettings={() => handlePhaseSelect('settings')} />
    </div>
  );
}
