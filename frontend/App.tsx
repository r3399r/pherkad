import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configStore } from './src/redux/store';
import Home from './src/screens/Home';

const { store, persistor } = configStore();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Home />
    </PersistGate>
  </Provider>
);

export default App;
