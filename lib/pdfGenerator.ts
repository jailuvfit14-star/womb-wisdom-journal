/**
 * PDF Generation Utility
 * Generates PDF files for journal entries with preserved fonts and colors
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { JournalEntry } from '@/types/journal';

/**
 * Format date to a readable format
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Generates a styled PDF for a journal entry
 * Preserves fonts and colors from the application design
 */
export async function generatePDF(entry: JournalEntry): Promise<void> {
  // Create a temporary container for the PDF content
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '60px';
  container.style.backgroundColor = '#fdfcfa'; // cream-50
  container.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
  container.style.color = '#5a4a40'; // cocoa-700

  // Add content with styling
  container.innerHTML = `
    <div style="max-width: 680px; margin: 0 auto;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #f5efe7; padding-bottom: 24px; margin-bottom: 32px;">
        <h1 style="font-family: 'Playfair Display', Georgia, Cambria, serif; font-size: 32px; color: #5a4a40; margin: 0 0 12px 0; font-weight: 700; line-height: 1.3;">
          ${escapeHtml(entry.title)}
        </h1>
        <p style="font-size: 14px; color: #a4907f; margin: 0; font-style: italic;">
          ${formatDate(entry.createdAt)}
        </p>
      </div>

      <!-- Content -->
      <div style="font-size: 16px; line-height: 1.8; color: #5a4a40; white-space: pre-wrap; word-wrap: break-word;">
        ${formatContentForPDF(entry.content)}
      </div>

      <!-- Footer -->
      <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #f5efe7; text-align: center;">
        <p style="font-size: 12px; color: #a4907f; font-style: italic; margin: 0;">
          From Aurora Journal
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Capture the container as canvas with high quality
    const canvas = await html2canvas(container, {
      useCORS: true,
      backgroundColor: '#fdfcfa',
      logging: false,
    } as any);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions to fit the page
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF (with pagination if needed)
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    const fileName = `${sanitizeFileName(entry.title)}_${new Date(entry.createdAt).toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

/**
 * Format markdown-like content for PDF display
 * Basic markdown parsing for better PDF rendering
 */
function formatContentForPDF(content: string): string {
  if (!content) return '<p style="color: #bfafa1; font-style: italic;">No content</p>';

  // Escape HTML first
  let formatted = escapeHtml(content);

  // Convert markdown headers
  formatted = formatted.replace(/^### (.+)$/gm, '<h3 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 20px; margin: 24px 0 12px 0; color: #5a4a40; font-weight: 600;">$1</h3>');
  formatted = formatted.replace(/^## (.+)$/gm, '<h2 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 24px; margin: 28px 0 14px 0; color: #5a4a40; font-weight: 600;">$1</h2>');
  formatted = formatted.replace(/^# (.+)$/gm, '<h1 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 28px; margin: 32px 0 16px 0; color: #5a4a40; font-weight: 700;">$1</h1>');

  // Convert bold and italic
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600; color: #705d51;">$1</strong>');
  formatted = formatted.replace(/\*(.+?)\*/g, '<em style="font-style: italic; color: #705d51;">$1</em>');

  // Convert lists
  formatted = formatted.replace(/^- (.+)$/gm, '<li style="margin: 4px 0; margin-left: 20px;">$1</li>');
  formatted = formatted.replace(/^(\d+)\. (.+)$/gm, '<li style="margin: 4px 0; margin-left: 20px; list-style-type: decimal;">$2</li>');

  return formatted;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitize filename for safe saving
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}
