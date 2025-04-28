import { configureStore } from "@reduxjs/toolkit";
import dataReducer from './slices/dataSlice';
import countReducer from './slices/count';
import dataShoppingReducer from './slices/dataShopping';
import countDiscount from './slices/dataDiscount';
import ordersReducer from './slices/orders'

export const store = configureStore({
  reducer: {
    data: dataReducer,
    count: countReducer,
    dataShopping: dataShoppingReducer,
    counterTow:countDiscount,
    ordersStorage: ordersReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
