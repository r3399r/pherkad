import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { inject, injectable } from 'inversify';
import { Bill } from 'src/model/Bill';
import { GoogleApi } from './GoogleApi';

/**
 * Service class for get/save bills.
 */
@injectable()
export class BillService {
  @inject(GoogleApi)
  private readonly googleApi!: GoogleApi;

  public async getBills(): Promise<Bill[]> {
    const sheet = await this.googleApi.getSheet();
    const rows = await sheet.getRows();

    return rows.map((v: GoogleSpreadsheetRow) => ({
      id: String(v.id),
      type: v.type === 'add' ? 'add' : 'minus',
      date: Number(v.date),
      amount: Number(v.amount),
      note: String(v.note),
    }));
  }

  public async addBill(bill: Bill): Promise<Bill[]> {
    const newBill: Bill = { ...bill, id: String(Date.now()) };
    const sheet = await this.googleApi.getSheet();
    await sheet.addRow(newBill);

    return await this.getBills();
  }

  public async deleteBill(id: string) {
    const sheet = await this.googleApi.getSheet();
    const rows = await sheet.getRows();

    const idx = rows.findIndex((v: GoogleSpreadsheetRow) => v.id === id);
    await rows[idx].delete();

    return await this.getBills();
  }

  public async reviseBill(bill: Bill) {
    const sheet = await this.googleApi.getSheet();
    const rows = await sheet.getRows();

    const idx = rows.findIndex((v: GoogleSpreadsheetRow) => v.id === bill.id);
    if (idx === -1) throw new Error('id not found');
    rows[idx].type = bill.type;
    rows[idx].amount = bill.amount;
    rows[idx].date = bill.date;
    rows[idx].note = bill.note;

    await rows[idx].save();

    return await this.getBills();
  }
}
