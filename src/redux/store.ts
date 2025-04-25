import { configureStore } from "@reduxjs/toolkit";
import dataReducer from './slices/dataSlice';
import countReducer from './slices/count';
import dataShoppingReducer from './slices/dataShopping';
export const store = configureStore({
  reducer: {
    data: dataReducer,
    count: countReducer,
    dataShopping: dataShoppingReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
