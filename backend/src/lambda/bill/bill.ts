import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { BillService } from 'src/logic/BillService';
import { Bill } from 'src/model/Bill';
import { BillEvent } from './BillEvent';

export async function bill(
  event: BillEvent,
  _context: LambdaContext
): Promise<any> {
  try {
    const billService: BillService = bindings.get<BillService>(BillService);

    let res: Bill[];

    switch (event.httpMethod) {
      case 'GET': {
        res = await billService.getBills();
        break;
      }
      case 'POST': {
        if (event.body === null) throw new Error('null body');

        const newBill: Bill = JSON.parse(event.body);
        res = await billService.addBill(newBill);
        break;
      }
      case 'PUT': {
        if (event.body === null) throw new Error('null body');

        const newBill: Bill = JSON.parse(event.body);
        res = await billService.reviseBill(newBill);
        break;
      }
      case 'DELETE': {
        if (event.queryStringParameters === null)
          throw new Error('null queryStringParameters');

        res = await billService.deleteBill(event.queryStringParameters.id);
        break;
      }
      default:
        throw new Error('unknown http method');
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify(res),
    };
  } catch (e) {
    console.error('[ERROR]', JSON.stringify(e));
  }
}
