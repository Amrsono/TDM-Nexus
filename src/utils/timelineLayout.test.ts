import { describe, it, expect } from 'vitest';
import {
  ragHex,
  statusColor,
  barColor,
  getTimelineMonths,
  getPhaseRanges,
  getMonthPhase,
  layoutTrackTasks,
  getMonthLabel,
  exampleMilestones,
} from './timelineLayout';
import { MilestoneRow } from '../types/poap';

describe('timelineLayout - Math, Range, and Color Computations', () => {
  describe('Color Helpers', () => {
    it('maps RAG values to appropriate hex colors', () => {
      expect(ragHex('Green')).toBe('#00B050');
      expect(ragHex('Amber')).toBe('#FFC000');
      expect(ragHex('Red')).toBe('#FF0000');
    });

    it('maps status names to text and bar colors', () => {
      expect(statusColor('Completed')).toBe('#00B050');
      expect(statusColor('In Progress')).toBe('#FFC000');
      expect(statusColor('Not Started')).toBe('#FF0000');

      expect(barColor('Done')).toBe('#00B050');
      expect(barColor('In Progress')).toBe('#FFC000');
      expect(barColor('Not Started')).toBe('#A6A6A6');
    });
  });

  describe('getTimelineMonths', () => {
    it('computes chronological month columns spanning date ranges', () => {
      const milestones: MilestoneRow[] = [
        { id: 1, name: 'Kick-off', status: 'Completed', startDate: '2026-03-01', targetedDate: '2026-06-30', releaseDate: '', actualDate: '' },
      ];
      const { months, timelineStart, timelineEnd } = getTimelineMonths(milestones);
      expect(months.length).toBe(4);
      expect(months[0].label).toBe('Mar 2026');
      expect(months[3].label).toBe('Jun 2026');
      expect(timelineStart.getMonth()).toBe(2); // 0-indexed March is 2
      expect(timelineEnd.getMonth()).toBe(5); // June is 5
    });

    it('defaults to 12 months when no dates are provided', () => {
      const { months } = getTimelineMonths([]);
      expect(months.length).toBe(12);
    });
  });

  describe('getPhaseRanges and getMonthPhase', () => {
    it('detects phase boundaries from milestones', () => {
      const ranges = getPhaseRanges(exampleMilestones);
      expect(ranges['Inception']).toBeDefined();
      expect(ranges['Elaboration']).toBeDefined();
      expect(ranges['Construction']).toBeDefined();
      expect(ranges['Inception'].start).toBeLessThan(ranges['Inception'].end);
    });

    it('assigns month dates to their enclosing or nearest phase', () => {
      const ranges = getPhaseRanges(exampleMilestones);
      const marchDate = new Date('2026-03-15');
      const phase = getMonthPhase(marchDate, ranges);
      expect(phase).toBe('Inception');
    });
  });

  describe('layoutTrackTasks', () => {
    it('stacks overlapping tasks into separate visual rows', () => {
      const overlappingTasks: MilestoneRow[] = [
        { id: 1, name: 'Task 1', status: 'In Progress', startDate: '2026-04-01', targetedDate: '2026-05-01', releaseDate: '', actualDate: '' },
        { id: 2, name: 'Task 2', status: 'In Progress', startDate: '2026-04-15', targetedDate: '2026-05-15', releaseDate: '', actualDate: '' },
      ];
      const rows = layoutTrackTasks(overlappingTasks);
      expect(rows.length).toBe(2);
      expect(rows[0][0].id).toBe(1);
      expect(rows[1][0].id).toBe(2);
    });

    it('packs sequential non-overlapping tasks into the same row', () => {
      const sequentialTasks: MilestoneRow[] = [
        { id: 1, name: 'Task 1', status: 'Completed', startDate: '2026-03-01', targetedDate: '2026-03-15', releaseDate: '', actualDate: '' },
        { id: 2, name: 'Task 2', status: 'In Progress', startDate: '2026-03-20', targetedDate: '2026-04-10', releaseDate: '', actualDate: '' },
      ];
      const rows = layoutTrackTasks(sequentialTasks);
      expect(rows.length).toBe(1);
      expect(rows[0].length).toBe(2);
    });
  });

  describe('getMonthLabel', () => {
    it('returns month and year for edge indices and full month name for inner indices', () => {
      const sampleMonth = { label: 'Jun 2026', dateStart: new Date(), dateEnd: new Date() };
      expect(getMonthLabel(sampleMonth, 0, 5)).toBe('Jun 2026');
      expect(getMonthLabel(sampleMonth, 4, 5)).toBe('Jun 2026');
      expect(getMonthLabel(sampleMonth, 2, 5)).toBe('June');
    });
  });
});
