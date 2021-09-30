import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Accounting } from 'src/model/Accounting';
import { compareKey } from 'src/util/compare';

// define the type of state
export type WalletState = {
  balance: number;
  accountings: Accounting[];
};

// define the initial value of state
const initialState: WalletState = {
  balance: 0,
  accountings: [],
};

// define the actions in "reducers"
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addAccounting: (state: WalletState, action: PayloadAction<Accounting>) => {
      const unsorted = [action.payload, ...state.accountings];
      state.accountings = unsorted.sort(compareKey('date', true));
      if (action.payload.type === 'add') state.balance += action.payload.amount;
      else if (action.payload.type === 'minus') state.balance -= action.payload.amount;
    },
    editAccounting: (
      state: WalletState,
      action: PayloadAction<{ i: number; accounting: Accounting }>,
    ) => {
      const oldAccounting = state.accountings[action.payload.i];
      const newAccounting = action.payload.accounting;
      if (oldAccounting.type === 'add' && newAccounting.type === 'add')
        state.balance = state.balance - oldAccounting.amount + newAccounting.amount;
      else if (oldAccounting.type === 'minus' && newAccounting.type === 'minus')
        state.balance = state.balance + oldAccounting.amount - newAccounting.amount;
      else if (oldAccounting.type === 'add' && newAccounting.type === 'minus')
        state.balance = state.balance - oldAccounting.amount - newAccounting.amount;
      else if (oldAccounting.type === 'minus' && newAccounting.type === 'add')
        state.balance = state.balance + oldAccounting.amount + newAccounting.amount;

      state.accountings[action.payload.i] = newAccounting;
      state.accountings = state.accountings.sort(compareKey('date', true));
    },
    deleteAccounting: (state: WalletState, action: PayloadAction<number>) => {
      const accounting = state.accountings[action.payload];
      if (accounting.type === 'add') state.balance -= accounting.amount;
      else if (accounting.type === 'minus') state.balance += accounting.amount;
      state.accountings.splice(action.payload, 1);
    },
  },
});

// action creators are generated for each case reducer function
export const { addAccounting, editAccounting, deleteAccounting } = walletSlice.actions;

export default walletSlice.reducer;
