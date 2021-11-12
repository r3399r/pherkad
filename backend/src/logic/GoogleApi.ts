import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { injectable } from 'inversify';

/**
 * Service class for google api.
 */
@injectable()
export class GoogleApi {
  private sheet: GoogleSpreadsheetWorksheet | undefined;

  public async getSheet() {
    if (this.sheet !== undefined) return this.sheet;

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL as string,
      private_key: (process.env.PRIVATE_KEY as string).replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();

    this.sheet = doc.sheetsByIndex[0];

    return this.sheet;
  }
}
