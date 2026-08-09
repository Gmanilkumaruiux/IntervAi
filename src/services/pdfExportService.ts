import { InterviewReport } from '../types/report';

export const pdfExportService = {
  /**
   * Trigger print/PDF export
   */
  exportToPDF(report: InterviewReport) {
    // Add print class to body and launch print dialog
    document.body.classList.add('printing-report');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-report');
    }, 300);
  }
};
