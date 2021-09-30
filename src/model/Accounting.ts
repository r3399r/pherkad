import { TYPE } from 'src/constant/Accounting';

export type Accounting = {
  type: TYPE;
  date: number;
  amount: number;
  note: string;
};
