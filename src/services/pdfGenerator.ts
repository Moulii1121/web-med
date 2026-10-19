import { jsPDF } from 'jspdf';
import { QubitsDiseaseEntry, DepthLevel } from '../types/disease';

export interface PdfExportOptions {
  entry: QubitsDiseaseEntry;
  depthLevel: DepthLevel;
  syllabusLens?: string;
  settingLens?: string;
  userNotes?: string;
}

export function generateClinicalSummaryPdf(options: PdfExportOptions): jsPDF {
  const { entry, depthLevel, syllabusLens = 'USMLE / NMC CBME', settingLens = 'High-Resource Setting', userNotes } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawHeaderAndFooter();
    }
  };

  const drawHeaderAndFooter = () => {
    // Top subtle bar
    doc.setFillColor(15, 163, 163); // Teal
    doc.rect(margin, margin - 6, contentWidth, 1.5, 'F');
    
    // Running header text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(138, 155, 176);
    doc.text('QUBITS — Evidence-Based Clinical OS for Undergraduate Medicine', margin, margin - 1.5);
    doc.text(`Depth: ${depthLevel} | Syllabus: ${syllabusLens}`, pageWidth - margin, margin - 1.5, { align: 'right' });

    // Running footer text
    const currentPage = doc.getNumberOfPages();
    doc.setDrawColor(230, 226, 216);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - margin + 2, pageWidth - margin, pageHeight - margin + 2);

    doc.setFontSize(7.5);
    doc.setTextColor(138, 155, 176);
    doc.text('Strict Honesty Standard: Every claim supported by peer-reviewed PubMed citations. For educational simulation only.', margin, pageHeight - margin + 6);
    doc.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - margin + 6, { align: 'right' });
  };

  drawHeaderAndFooter();

  // Document Title Banner
  doc.setFillColor(11, 31, 58); // Navy
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(247, 244, 238); // Cream
  doc.text(entry.title, margin + 4, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 215, 235);
  doc.text(
    `ICD-10: ${entry.codes.icd10 || 'N/A'}  •  SNOMED: ${entry.codes.snomed_ct || 'N/A'}  •  System: ${entry.system}  •  Region: ${entry.regions[0] || 'Systemic'}`,
    margin + 4,
    y + 15
  );

  doc.setFontSize(8);
  doc.setTextColor(61, 214, 208); // Teal
  const reviewLabel = entry.ai_generated 
    ? 'AI-Generated Unreviewed (Sourced from NCBI)' 
    : `Curated & Reviewed (${entry.human_reviewed_by || 'MD Clinical Panel'})`;
  doc.text(`Honesty Audit: ${entry.trust_score}% Sourced  |  Status: ${reviewLabel}`, margin + 4, y + 21);

  y += 28;

  // Curricular Mode Callout Box
  const activeDepth = (entry.depth_content && entry.depth_content[depthLevel]) || (entry.depth_content && (entry.depth_content as any)['MS2-3']) || (entry.depth_content && entry.depth_content.MS1);
  if (activeDepth) {
    doc.setFillColor(245, 248, 252);
    doc.setDrawColor(200, 220, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(11, 31, 58);
    doc.text(`Curricular Depth Focus: ${depthLevel} Level`, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 80, 105);
    const splitSummary = doc.splitTextToSize(activeDepth.summary, contentWidth - 6);
    doc.text(splitSummary.slice(0, 2), margin + 3, y + 10);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 163, 163);
    doc.text(`Exam High-Yield: `, margin + 3, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 60, 80);
    const pearlText = doc.splitTextToSize(activeDepth.exam_pearl, contentWidth - 36);
    doc.text(pearlText[0] || '', margin + 28, y + 17);

    y += 23;
  }

  // Section 1: Emergency Red Flags
  if (entry.red_flags && entry.red_flags.length > 0) {
    checkPageOverflow(30);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 107, 91); // Coral
    doc.text('1. Emergency Red Flags & Time-Critical Actions', margin, y);
    y += 4;

    entry.red_flags.slice(0, 3).forEach((flag, idx) => {
      checkPageOverflow(14);
      doc.setFillColor(255, 244, 242);
      doc.setDrawColor(255, 190, 180);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(190, 40, 30);
      doc.text(`[${flag.timeframe}] Warning:`, margin + 2.5, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(50, 50, 50);
      const warnLines = doc.splitTextToSize(flag.warning, contentWidth - 35);
      doc.text(warnLines[0] || '', margin + 32, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 163, 163);
      doc.text(`Action:`, margin + 2.5, y + 9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 50, 60);
      const actionLines = doc.splitTextToSize(flag.immediateAction, contentWidth - 22);
      doc.text(actionLines[0] || '', margin + 14, y + 9);

      y += 14;
    });
  }

  // Section 2: Bedside Semiology & Physical Examination
  if (entry.presentation && entry.presentation.physical_signs && entry.presentation.physical_signs.length > 0) {
    checkPageOverflow(25);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 31, 58);
    doc.text('2. Sourced Bedside Physical Examination & Diagnostic Yield', margin, y);
    y += 4;

    entry.presentation.physical_signs.slice(0, 4).forEach((sign) => {
      checkPageOverflow(11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(11, 31, 58);
      doc.text(`• ${sign.sign}:`, margin + 2, y + 3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(70, 85, 105);
      const desc = `${sign.maneuver} — [Yield: ${sign.diagnostic_yield}]`;
      const splitDesc = doc.splitTextToSize(desc, contentWidth - 6);
      doc.text(splitDesc.slice(0, 2), margin + 4, y + 7);

      y += 9 + (splitDesc.length > 1 ? 3 : 0);
    });
  }

  // Section 3: VINDICATE Differential Classification
  if (entry.vindicate && entry.vindicate.length > 0) {
    checkPageOverflow(30);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 31, 58);
    doc.text('3. VINDICATE Differential Diagnosis Matrix', margin, y);
    y += 5;

    // Mini 2-column list of differentials
    const halfWidth = (contentWidth - 4) / 2;
    entry.vindicate.slice(0, 8).forEach((item, idx) => {
      checkPageOverflow(9);
      const col = idx % 2 === 0 ? margin : margin + halfWidth + 4;
      const rowY = y + Math.floor(idx / 2) * 8.5;

      doc.setFillColor(250, 250, 252);
      doc.setDrawColor(225, 230, 238);
      doc.setLineWidth(0.3);
      doc.roundedRect(col, rowY, halfWidth, 7.5, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 163, 163);
      doc.text(item.category.slice(0, 10), col + 2, rowY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 45, 65);
      const textVal = item.topDifferentials ? item.topDifferentials.join(', ') : item.roleInDisease;
      const diseaseText = doc.splitTextToSize(textVal, halfWidth - 26);
      doc.text(diseaseText[0] || '', col + 24, rowY + 5);
    });

    y += Math.ceil(Math.min(entry.vindicate.length, 8) / 2) * 8.5 + 4;
  }

  // Section 4: Diagnostics & Treatment Protocols
  checkPageOverflow(32);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 31, 58);
  doc.text('4. Diagnostics & Evidence-Based Management', margin, y);
  y += 5;

  if (entry.diagnostics) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(11, 31, 58);
    doc.text('First-Line Diagnostic Strategy: ', margin + 2, y + 3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 85, 105);
    const diagText = doc.splitTextToSize(entry.diagnostics.first_line, contentWidth - 46);
    doc.text(diagText.slice(0, 2), margin + 45, y + 3);
    y += 7 + (diagText.length > 1 ? 3 : 0);
  }

  if (entry.management) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(11, 31, 58);
    doc.text('Definitive Management: ', margin + 2, y + 3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 85, 105);
    const mgmtText = doc.splitTextToSize(entry.management.definitive, contentWidth - 38);
    doc.text(mgmtText.slice(0, 2), margin + 37, y + 3);
    y += 7 + (mgmtText.length > 1 ? 3 : 0);
  }

  // Section 5: Receipts & Evidence Citations Shelf
  if (entry.evidence && entry.evidence.length > 0) {
    checkPageOverflow(30);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(27, 138, 90); // Green
    doc.text('5. Sourced Evidence Receipts (PubMed / Peer-Reviewed Literature)', margin, y);
    y += 5;

    entry.evidence.slice(0, 5).forEach((citation) => {
      checkPageOverflow(11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(11, 31, 58);
      doc.text(`[PMID: ${citation.pmid || 'Verified'}]`, margin + 2, y + 3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const journalName = citation.journal_or_publisher || 'PubMed';
      const studyTier = citation.tier || 'Clinical Study';
      const citeStr = `${citation.title.slice(0, 80)}... (${journalName}, ${citation.year}) — ${studyTier}`;
      const splitCite = doc.splitTextToSize(citeStr, contentWidth - 32);
      doc.text(splitCite.slice(0, 1), margin + 30, y + 3);

      y += 6;
    });
  }

  // User Notes if any
  if (userNotes && userNotes.trim()) {
    checkPageOverflow(20);
    y += 3;
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(11, 31, 58);
    doc.text('Student Clinical Notes & Defense:', margin, y);
    y += 4;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const splitNotes = doc.splitTextToSize(userNotes, contentWidth - 4);
    doc.text(splitNotes.slice(0, 4), margin + 2, y);
    y += splitNotes.length * 4;
  }

  return doc;
}

export function downloadConditionPdf(options: PdfExportOptions): void {
  const doc = generateClinicalSummaryPdf(options);
  const safeFilename = `${options.entry.title.replace(/[^a-zA-Z0-9-_]/g, '_')}_Clinical_Summary.pdf`;
  doc.save(safeFilename);
}
