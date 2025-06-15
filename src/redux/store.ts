import { Environments } from "@/constants/enums";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // يستخدم localStorage
import cartReducer from './features/cart/cartSlice';

const rootReducer  =combineReducers({
  cart: cartReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>{
    return getDefaultMiddleware({
      serializableCheck: false, 
    });
  },
  devTools: process.env.NODE_ENV === Environments.DEV,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
