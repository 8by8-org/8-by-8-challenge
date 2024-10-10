export interface VoterRegistrationDataRepository {
  getPDFUrlByUserId(userId: string): Promise<string>;
  savePDFUrl(userId: string, pdfUrl: string): Promise<void>;
}
