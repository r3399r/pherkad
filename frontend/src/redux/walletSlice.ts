import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill } from 'src/model/Bill';
import { compareKey } from 'src/util/compare';

// define the type of state
export type WalletState = {
  bills: Bill[];
};

// define the initial value of state
const initialState: WalletState = {
  bills: [],
};

// define the actions in "reducers"
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBills: (state: WalletState, action: PayloadAction<Bill[]>) => {
      state.bills = action.payload.sort(compareKey('date', true));
    },
  },
});

// action creators are generated for each case reducer function
export const { setBills } = walletSlice.actions;

export default walletSlice.reducer;
