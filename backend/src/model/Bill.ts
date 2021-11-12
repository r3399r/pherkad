export type Bill = {
  id: string;
  type: 'add' | 'minus';
  date: number;
  amount: number;
  note?: string;
};
