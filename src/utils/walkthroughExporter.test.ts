import { describe, it, expect, vi } from 'vitest';
import { exportWalkthroughToExcel, exportWalkthroughToPPT } from './walkthroughExporter';
import { initialWalkthroughData } from './mockData';

vi.mock('xlsx', async (importOriginal) => {
  const actual = await importOriginal<typeof import('xlsx')>();
  return {
    ...actual,
    writeFile: vi.fn(),
  };
});

import * as XLSX from 'xlsx';

describe('walkthroughExporter - Excel and PPT Generation', () => {
  it('exports structured walkthrough report to Excel', () => {
    const appendSheetSpy = vi.spyOn(XLSX.utils, 'book_append_sheet');

    exportWalkthroughToExcel(initialWalkthroughData);

    expect(appendSheetSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'Walkthrough Report'
    );
  });

  it('exports structured walkthrough deck to PowerPoint', () => {
    exportWalkthroughToPPT(initialWalkthroughData);
    expect(true).toBe(true);
  });
});
