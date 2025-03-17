import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Uses localStorage
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from '../slice/authSlice';

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export const persistor = persistStore(store);
