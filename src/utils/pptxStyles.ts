import pptxgen from 'pptxgenjs';

// VOIS Official Brand Colours
export const VF_RED = 'E60000'; // VOIS Primary Red
export const VF_WHITE = 'FFFFFF'; // White
export const VF_BLACK = '333333'; // VOIS Black
export const VF_AUBERGINE = '5E2750'; // VOIS Finn / Aubergine
export const VF_ABBEY = '4A4D4E'; // VOIS Abbey
export const VF_CERULEAN = '00B0CA'; // VOIS Cerulean
export const VF_LAGOON = '007C92'; // VOIS Blue Lagoon
export const VF_SEANCE = '9C2AA0'; // VOIS Seance
export const VF_GRAY_MID = 'D6D6D6'; // Neutral mid-grey
export const VF_GRAY_LITE = 'F4F4F4'; // Neutral light-grey card fill
export const VF_RED_LITE = 'FCEAEA'; // Soft VOIS red tint

// RAG Status Colours
export const COLOR_GREEN = '428600';
export const COLOR_AMBER = 'EB9700';
export const COLOR_RED = 'E60000';

export const VF_FONT = 'Outfit';

export const getRagHex = (val: string): string => {
  if (val.toLowerCase() === 'green') return COLOR_GREEN;
  if (val.toLowerCase() === 'amber') return COLOR_AMBER;
  return COLOR_RED;
};

export const addSlideHeader = (slide: pptxgen.Slide, title: string, slideNum?: number) => {
  slide.background = { color: VF_WHITE };
  slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: VF_RED } });
  slide.addText(title, {
    x: 0.5, y: 0.2, w: 10.0, h: 0.6,
    fontSize: 24, bold: true, color: VF_AUBERGINE, fontFace: VF_FONT,
  });
  slide.addShape('rect', { x: 0.5, y: 0.85, w: 1.5, h: 0.04, fill: { color: VF_RED } });
  slide.addShape('rect', { x: 0, y: 7.3, w: '100%', h: 0.2, fill: { color: VF_AUBERGINE } });
  slide.addText('TDM NEXUS  •  Steering Committee Report', {
    x: 0.3, y: 7.32, w: 8.0, h: 0.15, fontSize: 7, color: VF_GRAY_MID, fontFace: VF_FONT,
  });
  const badgeX = slideNum !== undefined ? 11.3 : 12.0;
  slide.addShape('rect', { x: badgeX, y: 7.05, w: 1.3, h: 0.4, fill: { color: VF_RED } });
  slide.addText('VOIS', {
    x: badgeX, y: 7.05, w: 1.3, h: 0.4, fontSize: 9, bold: true,
    color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle',
  });
  if (slideNum !== undefined) {
    slide.addShape('rect', { x: 12.7, y: 7.05, w: 0.6, h: 0.4, fill: { color: VF_AUBERGINE } });
    slide.addText(slideNum.toString(), {
      x: 12.7, y: 7.05, w: 0.6, h: 0.4, fontSize: 14, bold: true,
      color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle',
    });
  }
};
