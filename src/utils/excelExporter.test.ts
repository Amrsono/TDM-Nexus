import { describe, it, expect, vi } from 'vitest';
import { exportToExcel } from './excelExporter';
import {
  initialFinancials,
  initialADOWorkItems,
  initialSquads,
  initialAllocations,
  initialTransfers,
  initialQAGates,
  initialDefects,
  initialRisks,
} from './mockData';

vi.mock('xlsx', async (importOriginal) => {
  const actual = await importOriginal<typeof import('xlsx')>();
  return {
    ...actual,
    writeFile: vi.fn(),
  };
});

import * as XLSX from 'xlsx';

describe('excelExporter - Multi-Sheet Workbook Generation', () => {
  it('constructs complete workbook with all reporting sheets and triggers download', () => {
    const appendSheetSpy = vi.spyOn(XLSX.utils, 'book_append_sheet');

    exportToExcel(
      initialFinancials,
      initialADOWorkItems,
      initialSquads,
      initialAllocations,
      initialTransfers,
      initialQAGates,
      initialDefects,
      initialRisks,
      'AI Analysis Summary'
    );

    expect(appendSheetSpy).toHaveBeenCalledTimes(9);
    const sheetNames = appendSheetSpy.mock.calls.map(call => call[2]);
    expect(sheetNames).toContain('Project Overview');
    expect(sheetNames).toContain('Squad Finances');
    expect(sheetNames).toContain('Fund Transfers');
    expect(sheetNames).toContain('ADO Work Items');
    expect(sheetNames).toContain('Portfolio Squads');
    expect(sheetNames).toContain('QA Gates');
    expect(sheetNames).toContain('Defects Log');
    expect(sheetNames).toContain('RAID Log');
    expect(sheetNames).toContain('AI Analysis');
  });
});
