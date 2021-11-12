import { TYPE } from 'src/constant/Bill';

export type Bill = {
  id: string;
  type: TYPE;
  date: number;
  amount: number;
  note?: string;
};
