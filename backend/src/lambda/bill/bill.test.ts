import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { BillService } from 'src/logic/BillService';
import { Bill } from 'src/model/Bill';
import { bill } from './bill';
import { BillEvent } from './BillEvent';

/**
 * Tests of the bill function.
 */
describe('bill', () => {
  let event: BillEvent;
  let lambdaContext: LambdaContext;
  let mockBillService: any;
  let dummyBills: Bill[];

  beforeAll(() => {
    dummyBills = [
      {
        id: 'testId',
        type: 'add',
        date: 1632388292887,
        amount: 123,
        note: 'test',
      },
    ];
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockBillService
    mockBillService = { getBills: jest.fn(), addBill: jest.fn() };
    bindings.rebind<BillService>(BillService).toConstantValue(mockBillService);
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      body: null,
      queryStringParameters: null,
    };
    await bill(event, lambdaContext);
    expect(mockBillService.getBills).toBeCalledTimes(1);
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      body: JSON.stringify(dummyBills[0]),
      queryStringParameters: null,
    };
    await bill(event, lambdaContext);
    expect(mockBillService.addBill).toBeCalledTimes(1);
  });
});
