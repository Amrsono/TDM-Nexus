import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SlidePreview } from './SlidePreview';
import { exampleMilestones } from '../../utils/timelineLayout';
import { POAPSlideData } from '../../types/poap';

const mockPOAPForm: POAPSlideData = {
  projectName: 'Core Modernization',
  reqId: 'REQ-9921',
  projectManager: 'Amr Sono',
  expectedClosure: '2026-12-31',
  portfolio: 'Digital Core',
  transition: 'DevOps Pod 1',
  ragOverall: 'Green',
  mpGate: 'Pass',
  build: 'In Progress',
  projectGate: 'Active',
  projectScope: 'Modernize database and APIs\nAutomate release pipelines',
  currentStatus: 'SIT test phase active\nNo critical blockers',
  milestones: exampleMilestones,
  obstacles: 'Resource availability',
  planAssumptions: 'Infrastructure ready\nTeam allocated',
};

describe('SlidePreview Component', () => {
  it('renders Slide 1 (Status Report) with project name, RAG indicators, and scope', () => {
    render(<SlidePreview form={mockPOAPForm} activeSlide={1} />);
    expect(screen.getByText(/Core Modernization/i)).toBeInTheDocument();
    expect(screen.getByText('REQ ID')).toBeInTheDocument();
    expect(screen.getByText('REQ-9921')).toBeInTheDocument();
    expect(screen.getByText(/Modernize database and APIs/i)).toBeInTheDocument();
    expect(screen.getByText(/SIT test phase active/i)).toBeInTheDocument();
  });

  it('renders Slide 2 (Visual Roadmap / Timeline)', () => {
    render(<SlidePreview form={mockPOAPForm} activeSlide={2} />);
    expect(screen.getByText(/Core Modernization/i)).toBeInTheDocument();
    expect(screen.getByText(/Milestones Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/RAG Legend/i)).toBeInTheDocument();
  });

  it('renders Slide 3 (Delivery Plan Timeline)', () => {
    render(<SlidePreview form={mockPOAPForm} activeSlide={3} />);
    expect(screen.getByText(/Core Modernization/i)).toBeInTheDocument();
    expect(screen.getByText('Track / Month')).toBeInTheDocument();
    expect(screen.getByText(/Indicative Plan on a Page/i)).toBeInTheDocument();
  });
});
