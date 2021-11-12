import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  combineReducers,
  configureStore,
  EmptyObject,
  EnhancedStore,
  PayloadAction,
} from '@reduxjs/toolkit';
import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { PersistPartial } from 'redux-persist/lib/persistReducer';
import walletReducer, { WalletState } from './walletSlice';

export type RootState = {
  wallet: WalletState;
};

let store: EnhancedStore<RootState & PersistPartial>;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  wallet: walletReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configStore = () => {
  store = configureStore({
    reducer: persistedReducer,
    middleware: (
      getDefaultMiddleware: CurriedGetDefaultMiddleware<
        EmptyObject & {
          wallet: WalletState;
        } & PersistPartial
      >,
    ) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  return { store, persistor: persistStore(store) };
};

export const getState = () => store.getState();

export const dispatch = <T>(action: PayloadAction<T>) => store.dispatch(action);
