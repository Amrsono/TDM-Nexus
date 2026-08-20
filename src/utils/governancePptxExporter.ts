import pptxgen from 'pptxgenjs';
import { GovernanceGateDetail } from './mockData';
import { VF_RED, VF_WHITE, VF_BLACK, VF_AUBERGINE, VF_GRAY_MID, VF_RED_LITE, VF_FONT } from './pptxStyles';

export const exportGovernanceGatesToPPT = (
  gates: GovernanceGateDetail[],
  singleGateId?: string
) => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  const gatesToExport = singleGateId
    ? gates.filter(g => g.id === singleGateId)
    : gates;

  gatesToExport.forEach(gate => {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    slide.addText(gate.title.toUpperCase(), {
      x: 0.5,
      y: 0.3,
      w: 12.3,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: 'E60000',
      fontFace: 'Outfit',
    });

    slide.addText([
      { text: 'Objective: ', options: { bold: true, color: 'E60000' } },
      { text: gate.objective, options: { color: 'E60000' } },
    ], {
      x: 0.5,
      y: 1.1,
      w: 4.8,
      h: 1.2,
      line: { color: 'E60000', width: 2 },
      fill: { color: 'FFFFFF' },
      valign: 'middle',
      fontSize: 11,
      fontFace: 'Outfit',
      margin: 10,
    });

    slide.addText('Entry criteria:', {
      x: 0.5,
      y: 2.5,
      w: 4.8,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: '000000',
      fontFace: 'Outfit',
    });

    const entryText = gate.entryCriteria
      .filter(item => item.trim() !== '')
      .map(item => ({
        text: item,
        options: { bullet: true, color: '000000', fontSize: 10 },
      }));
    slide.addText(entryText, {
      x: 0.5,
      y: 2.8,
      w: 4.8,
      h: 1.3,
      fontSize: 10,
      fontFace: 'Outfit',
      lineSpacing: 14,
    });

    slide.addText('Output:', {
      x: 0.5,
      y: 4.2,
      w: 4.8,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: '000000',
      fontFace: 'Outfit',
    });

    const outputText = gate.outputs
      .filter(item => item.trim() !== '')
      .map(item => ({
        text: item,
        options: { bullet: true, color: '000000', fontSize: 10 },
      }));
    slide.addText(outputText, {
      x: 0.5,
      y: 4.5,
      w: 4.8,
      h: 1.0,
      fontSize: 10,
      fontFace: 'Outfit',
      lineSpacing: 14,
    });

    const isCR = gate.id === 'cr';
    const audienceY = isCR ? 5.4 : 5.6;

    const audienceText: Array<{ text: string; options?: { bold?: boolean; color?: string } }> = [
      { text: 'Mandatory Audience: ', options: { bold: true, color: '000000' } },
      { text: gate.mandatoryAudience + '\n\n', options: { color: '333333' } },
    ];
    if (gate.optionalAudience) {
      audienceText.push({ text: 'Optional Audience: ', options: { bold: true, color: '000000' } });
      audienceText.push({ text: gate.optionalAudience, options: { color: '333333' } });
    }

    slide.addText(audienceText, {
      x: 0.5,
      y: audienceY,
      w: 4.8,
      h: isCR ? 0.7 : 1.0,
      fontSize: 10,
      fontFace: 'Outfit',
    });

    if (isCR && gate.typesConsidered && gate.typesNotConsidered) {
      slide.addText('The following types of CRs will be considered:', {
        x: 0.5,
        y: 6.1,
        w: 5.8,
        h: 0.25,
        fontSize: 12,
        bold: true,
        color: '008000',
        fontFace: 'Outfit',
      });
      const consText = gate.typesConsidered
        .filter(item => item.trim() !== '')
        .map(item => ({
          text: item,
          options: { bullet: { code: '2022' }, color: '333333', fontSize: 10 },
        }));
      slide.addText(consText, {
        x: 0.5,
        y: 6.4,
        w: 5.8,
        h: 0.9,
        fontSize: 10,
        fontFace: 'Outfit',
        lineSpacing: 14,
      });

      slide.addText('The following types of CRs will not be considered:', {
        x: 6.8,
        y: 6.1,
        w: 6.0,
        h: 0.25,
        fontSize: 12,
        bold: true,
        color: 'E60000',
        fontFace: 'Outfit',
      });
      const notConsText = gate.typesNotConsidered
        .filter(item => item.trim() !== '')
        .map(item => ({
          text: item,
          options: { bullet: { code: '2022' }, color: '333333', fontSize: 10 },
        }));
      slide.addText(notConsText, {
        x: 6.8,
        y: 6.4,
        w: 6.0,
        h: 0.9,
        fontSize: 10,
        fontFace: 'Outfit',
        lineSpacing: 14,
      });
    }

    const tableHeader = [
      { text: 'Participant', options: { bold: true, color: 'FFFFFF', fill: { color: 'E60000' }, align: 'left' as const, valign: 'middle' as const } },
      { text: 'Input (Actions Done)', options: { bold: true, color: 'FFFFFF', fill: { color: 'E60000' }, align: 'left' as const, valign: 'middle' as const } },
      { text: 'Output (Actions to do)', options: { bold: true, color: 'FFFFFF', fill: { color: 'E60000' }, align: 'left' as const, valign: 'middle' as const } },
    ];

    const tableRows: pptxgen.TableRow[] = [tableHeader];

    const formatCellWithBullets = (items: string[]) => {
      const activeItems = items.filter(item => item.trim() !== '');
      if (activeItems.length === 0 || (activeItems.length === 1 && activeItems[0].trim() === 'N/A')) {
        return [{ text: 'N/A', options: { color: '333333', fontSize: 9 } }];
      }
      return activeItems.map(item => ({
        text: item,
        options: { bullet: true, color: '333333', fontSize: 9 },
      }));
    };

    gate.participants.forEach(p => {
      tableRows.push([
        { text: [{ text: p.participant, options: { bold: true, color: '000000', fontSize: 10 } }], options: { fill: { color: 'FCE4E4' }, valign: 'middle' } },
        { text: formatCellWithBullets(p.inputs), options: { fill: { color: 'FCE4E4' }, valign: 'middle' } },
        { text: formatCellWithBullets(p.outputs), options: { fill: { color: 'FCE4E4' }, valign: 'middle' } },
      ]);
    });

    const tableH = isCR ? 4.3 : 5.0;
    slide.addTable(tableRows, {
      x: 5.6,
      y: 1.1,
      w: 7.2,
      h: tableH,
      border: { type: 'solid', color: 'FFFFFF', pt: 2 },
      fontSize: 9,
      fontFace: 'Outfit',
      valign: 'middle',
      margin: 6,
    });
  });

  const fileName = singleGateId
    ? `${gatesToExport[0].title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}_Report.pptx`
    : 'TDM_Release_Governance_Gate_Deck.pptx';

  pptx.writeFile({ fileName });
};

export const exportAIInsightToPPT = (
  title: string,
  markdownContent: string
) => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  const cleanContent = markdownContent
    .replace(/\*\*/g, '')
    .replace(/#/g, '')
    .replace(/\\ge\b/g, '>=')
    .replace(/\\le\b/g, '<=')
    .replace(/\\%/g, '%')
    .replace(/\$/g, '');

  const paragraphs = cleanContent.split(/\n\n|\r\n\r\n/);
  const chunks: string[] = [];
  let currentChunk = '';

  paragraphs.forEach(p => {
    if ((currentChunk.length + p.length) > 1200 && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = p + '\n\n';
    } else {
      currentChunk += p + '\n\n';
    }
  });
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  chunks.forEach((chunk, index) => {
    const slide = pptx.addSlide();

    slide.background = { color: VF_WHITE };
    slide.addShape(pptxgen.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: VF_RED } });

    slide.addText(`TDM NEXUS AI INSIGHT ${chunks.length > 1 ? `(${index + 1}/${chunks.length})` : ''}`, {
      x: 0.5, y: 0.2, w: 10.0, h: 0.6,
      fontSize: 24, bold: true, color: VF_AUBERGINE, fontFace: VF_FONT,
    });
    slide.addShape(pptxgen.ShapeType.rect, { x: 0.5, y: 0.85, w: 1.5, h: 0.04, fill: { color: VF_RED } });

    slide.addShape(pptxgen.ShapeType.rect, { x: 0.5, y: 1.2, w: 12.3, h: 5.8, fill: { color: VF_RED_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
    slide.addShape(pptxgen.ShapeType.rect, { x: 0.5, y: 1.2, w: 0.08, h: 5.8, fill: { color: VF_RED } });

    slide.addText(title, { x: 0.75, y: 1.25, w: 11.0, h: 0.35, fontSize: 14, bold: true, color: VF_RED, fontFace: VF_FONT });

    slide.addText(chunk, {
      x: 0.75, y: 1.7, w: 11.8, h: 5.2,
      fontSize: 11, color: VF_BLACK, fontFace: 'Arial',
      align: 'left', valign: 'top', lineSpacing: 16,
    });

    slide.addShape(pptxgen.ShapeType.rect, { x: 0, y: 7.3, w: '100%', h: 0.2, fill: { color: VF_AUBERGINE } });
    slide.addText('TDM NEXUS  •  AI Generated Insight', {
      x: 0.3, y: 7.32, w: 8.0, h: 0.15, fontSize: 7, color: VF_GRAY_MID, fontFace: VF_FONT,
    });

    const badgeX = 12.0;
    slide.addShape(pptxgen.ShapeType.rect, { x: badgeX, y: 7.05, w: 1.3, h: 0.4, fill: { color: VF_RED } });
    slide.addText('VOIS', {
      x: badgeX, y: 7.05, w: 1.3, h: 0.4, fontSize: 9, bold: true,
      color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle',
    });
  });

  pptx.writeFile({ fileName: `TDM_AI_Insight_${new Date().getTime()}.pptx` });
};
