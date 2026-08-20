import React from 'react';
import {
  FolderOpen,
  Compass,
  Wrench,
  CircleDollarSign,
  Bug,
  Scale,
  ShieldCheck,
  LayoutTemplate,
  Settings as SettingsIcon,
  SlidersHorizontal,
  ClipboardList,
  BookOpen,
} from 'lucide-react';

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

export interface PhaseMetadata {
  id: PhaseId;
  name: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  color: string;
}

export const PHASES: PhaseMetadata[] = [
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

export const getPhaseMetadata = (id: PhaseId): PhaseMetadata => {
  return PHASES.find((p) => p.id === id) || PHASES[0];
};
