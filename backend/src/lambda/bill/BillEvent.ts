export interface BillEvent {
  httpMethod: string;
  body: string | null;
  queryStringParameters: { id: string } | null;
}
