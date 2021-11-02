import axios from 'axios';
import { Bill } from 'src/model/Bill';

const apiEndpoint = 'https://053rmjnia5.execute-api.ap-northeast-1.amazonaws.com/test';

export const getBills = async () => {
  const res = await axios.get<Bill[]>(`${apiEndpoint}/bill`);

  return res.data;
};

export const addBill = async (bill: Bill) => {
  const res = await axios.post<Bill[]>(`${apiEndpoint}/bill`, bill);

  return res.data;
};

export const deleteBill = async (id: string) => {
  const res = await axios.delete<Bill[]>(`${apiEndpoint}/bill?id=${id}`);

  return res.data;
};

export const reviseBill = async (bill: Bill) => {
  const res = await axios.put<Bill[]>(`${apiEndpoint}/bill`, bill);

  return res.data;
};
