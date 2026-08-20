import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Presentation,
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
import { useProject } from './context/ProjectContext';
import { AIAssistantApplet } from './components/AIAssistantApplet';
import { generateReportAnalytics } from './utils/aiService';
import { PHASES, getPhaseMetadata, PhaseId } from './config/phases';

export type { PhaseId };

export default function App() {
  const { setProjectState, settings } = useAIAssistant();
  const {
    state,
    dispatch,
    ragStatus,
    budgetProgressPercent,
    sitProgressPercent,
    checklistPercent,
    projectState,
  } = useProject();

  const [activePhase, setActivePhase] = useState<PhaseId>('funnel');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    walkthroughData,
  } = state;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    setProjectState(projectState);
  }, [projectState, setProjectState]);

  const activeMetadata = useMemo(() => {
    return getPhaseMetadata(activePhase);
  }, [activePhase]);

  const handlePhaseSelect = (phaseId: string) => {
    if (PHASES.some((p) => p.id === phaseId)) {
      setActivePhase(phaseId as PhaseId);
      setSidebarOpen(false);
    }
  };

  const renameSquad = (id: string, newName: string) => {
    const s = squads.find((x) => x.id === id);
    if (s) {
      dispatch({ type: 'UPDATE_SQUAD_NAME', payload: { id, oldName: s.name, newName } });
    }
  };

  const deleteSquad = (id: string) => {
    const s = squads.find((x) => x.id === id);
    if (!s) return;
    const oldName = s.name;
    dispatch({ type: 'SET_SQUADS', payload: (prev) => prev.filter((item) => item.id !== id) });
    dispatch({ type: 'SET_ALLOCATIONS', payload: (prev) => prev.filter((a) => a.squadId !== id) });
    dispatch({
      type: 'SET_TRANSFERS',
      payload: (prev) => prev.filter((t) => t.fromSquad !== oldName && t.toSquad !== oldName),
    });
    dispatch({
      type: 'SET_DEFECTS',
      payload: (prev) => prev.map((d) => (d.squad === oldName ? { ...d, squad: 'Unassigned' } : d)),
    });
    dispatch({
      type: 'SET_ADO_WORK_ITEMS',
      payload: (prev) => prev.map((a) => (a.portfolio === oldName ? { ...a, portfolio: 'Unassigned' } : a)),
    });
  };

  const clearAllSquads = () => {
    dispatch({ type: 'SET_SQUADS', payload: [] });
    dispatch({ type: 'SET_ALLOCATIONS', payload: [] });
    dispatch({ type: 'SET_TRANSFERS', payload: [] });
    dispatch({ type: 'SET_DEFECTS', payload: (prev) => prev.map((d) => ({ ...d, squad: 'Unassigned' })) });
    dispatch({ type: 'SET_ADO_WORK_ITEMS', payload: (prev) => prev.map((a) => ({ ...a, portfolio: 'Unassigned' })) });
  };

  const renderActiveView = () => {
    switch (activePhase) {
      case 'funnel':
        return (
          <FunnelReviewing
            financials={financials}
            setFinancials={(payload) => dispatch({ type: 'SET_FINANCIALS', payload })}
          />
        );
      case 'analysing':
        return (
          <Analysing
            adoWorkItems={adoWorkItems}
            setAdoWorkItems={(payload) => dispatch({ type: 'SET_ADO_WORK_ITEMS', payload })}
            squads={squads}
            setSquads={(payload) => dispatch({ type: 'SET_SQUADS', payload })}
            renameSquad={renameSquad}
            deleteSquad={deleteSquad}
            clearAllSquads={clearAllSquads}
          />
        );
      case 'finances':
        return (
          <FinancesApprovals
            financials={financials}
            setFinancials={(payload) => dispatch({ type: 'SET_FINANCIALS', payload })}
            allocations={allocations}
            setAllocations={(payload) => dispatch({ type: 'SET_ALLOCATIONS', payload })}
            transfers={transfers}
            setTransfers={(payload) => dispatch({ type: 'SET_TRANSFERS', payload })}
            forecastMonths={forecastMonths}
          />
        );
      case 'build':
        return (
          <ImplementingBuild
            squads={squads}
            setSquads={(payload) => dispatch({ type: 'SET_SQUADS', payload })}
            milestones={milestones}
            setMilestones={(payload) => dispatch({ type: 'SET_MILESTONES', payload })}
          />
        );
      case 'testing':
        return (
          <TestingQuality
            qaGates={qaGates}
            setQaGates={(payload) => dispatch({ type: 'SET_QA_GATES', payload })}
            defects={defects}
            setDefects={(payload) => dispatch({ type: 'SET_DEFECTS', payload })}
            squads={squads}
          />
        );
      case 'governance':
        return (
          <ReleaseGovernance
            risks={risks}
            setRisks={(payload) => dispatch({ type: 'SET_RISKS', payload })}
            ragStatus={ragStatus}
            setRagStatus={(payload: any) => dispatch({ type: 'SET_RAG_STATUS', payload })}
            financials={financials}
            squads={squads}
            defects={defects}
            checklist={checklist}
            setChecklist={(payload) => dispatch({ type: 'SET_CHECKLIST', payload })}
          />
        );
      case 'postlaunch':
        return (
          <PostLaunchELS
            hypercare={hypercare}
            setHypercare={(payload) => dispatch({ type: 'SET_HYPERCARE', payload })}
          />
        );
      case 'poap':
        return (
          <POAP
            poapData={poapData}
            setPoapData={(payload) => dispatch({ type: 'SET_POAP_DATA', payload })}
            ragStatus={ragStatus}
          />
        );
      case 'releaseplanning':
        return (
          <ReleasePlanningMeeting
            gates={governanceGates}
            setGates={(payload) => dispatch({ type: 'SET_GOVERNANCE_GATES', payload })}
          />
        );
      case 'walkthrough':
        return (
          <WalkthroughWizard
            data={walkthroughData}
            setData={(payload) => dispatch({ type: 'SET_WALKTHROUGH_DATA', payload })}
          />
        );
      case 'slidebuilder':
        return <POAPSlideBuilder />;
      case 'settings':
        return <SettingsView theme={theme} setTheme={setTheme} />;
      default:
        return (
          <FunnelReviewing
            financials={financials}
            setFinancials={(payload) => dispatch({ type: 'SET_FINANCIALS', payload })}
          />
        );
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
    <>
      <div className="dashboard-container">
        <div className="grid-bg-overlay"></div>
        <div className="scanlines-overlay"></div>

        {/* Sidebar Backdrop Drawer Overlay for mobile */}
        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Sidebar Navigation */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
          <div>
            <div
              className="sidebar-logo"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                TDM <span>NEXUS</span>
              </div>
              <button
                className="hamburger-btn mobile-close-btn"
                onClick={() => setSidebarOpen(false)}
                style={{ padding: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                aria-label="Close navigation menu"
              >
                <X size={20} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>
            <ul className="nav-list">
              {PHASES.map((p) => {
                const Icon = p.icon;
                return (
                  <li
                    key={p.id}
                    className={`nav-item ${activePhase === p.id ? 'active' : ''}`}
                    onClick={() => handlePhaseSelect(p.id)}
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
          {activePhase !== 'settings' && activePhase !== 'slidebuilder' && (
            <div className="three-viewport-wrapper">
              <ThreeCanvas activePhase={activePhase} onPhaseSelect={handlePhaseSelect} />
            </div>
          )}

          {/* Front Panel HUD and Active View Card */}
          <div className="ui-overlay-container">
            <div className="scroll-content-wrapper">
              {/* Top HUD Banner */}
              <header className="hud-banner glass-panel">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    className="hamburger-btn"
                    onClick={() => setSidebarOpen(true)}
                    title="Toggle Menu"
                    aria-label="Toggle navigation menu"
                  >
                    <Menu size={20} />
                  </button>
                  <div className="hud-stat">
                    <span className="hud-stat-label">Project / Increment</span>
                    <span className="hud-stat-value mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
                      PRJ-VELOCITY (PI40)
                    </span>
                  </div>
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
                      ${(financials.totalSpent / 1000000).toFixed(2)}M / ${(
                        (financials.capexLimit + financials.opexLimit) /
                        1000000
                      ).toFixed(2)}M ({budgetProgressPercent}%)
                    </span>
                  </div>

                  <div className="hud-stat">
                    <span className="hud-stat-label">SIT Pass Rate</span>
                    <span
                      className="hud-stat-value mono"
                      style={{ color: sitProgressPercent > 70 ? 'var(--color-green)' : 'var(--color-amber)' }}
                    >
                      {sitProgressPercent}%
                    </span>
                  </div>

                  <div className="hud-stat">
                    <span className="hud-stat-label">Governance Readiness</span>
                    <span className="hud-stat-value mono">{checklistPercent}%</span>
                  </div>
                </div>
              </header>

              {/* Active View Module */}
              <div
                className="active-view-overlay glass-panel"
                style={activePhase === 'slidebuilder' ? { maxWidth: 'none' } : undefined}
              >
                <div className="view-header">
                  <div className="view-title">
                    {React.createElement(activeMetadata.icon, {
                      size: 22,
                      className: 'mono',
                      style: { color: activeMetadata.color },
                    })}
                    <h2 className="mono" style={{ textTransform: 'uppercase' }}>
                      {activeMetadata.name}
                    </h2>
                  </div>

                  {/* Excel and PPT Exporters */}
                  <div style={{ display: 'flex', gap: '0.75rem', pointerEvents: 'auto' }}>
                    <button
                      className="cyber-button"
                      onClick={handleExcelExport}
                      title="Export project details, finances, NFRs to Excel"
                    >
                      <FileSpreadsheet size={16} />
                      <span className="cyber-btn-text">Export Excel</span>
                    </button>
                    <button
                      className="cyber-button secondary"
                      onClick={handlePPTExport}
                      title="Export SteerCo Steering Committee PPT deck"
                    >
                      <Presentation size={16} />
                      <span className="cyber-btn-text">Export PPT</span>
                    </button>
                  </div>
                </div>

                <div className="view-body">{renderActiveView()}</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AIAssistantApplet activePhase={activePhase} onNavigateToSettings={() => handlePhaseSelect('settings')} />
    </>
  );
}
