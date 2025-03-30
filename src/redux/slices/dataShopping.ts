import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { get_data } from "@/calls/constant";

const isClient = typeof window !== "undefined";

interface DataState {
  itemsShopping: any[]; 
  show: boolean;
  sup_total: number;
}

const initialState: DataState = { 
  itemsShopping: [], 
  show: false,
  sup_total: 0,
};

export const dataShopping = createSlice({
  name: "dataShopping",
  initialState,
  reducers: {
    setShow: (state) => {
      state.show = !state.show;
    },

    removeItemsShopping: (state, action: PayloadAction<number>) => {
      state.itemsShopping = state.itemsShopping.filter((_, i) => i !== action.payload);
      state.sup_total = state.itemsShopping.reduce((prev, current) => prev + current.count * current.price, 0);
      if (isClient) {
        localStorage.setItem(get_data, JSON.stringify(state.itemsShopping));
      }
    },

    addItemsShopping: (state, action: PayloadAction<any[]>) => {
      state.itemsShopping = [...state.itemsShopping, ...action.payload];
      state.sup_total = state.itemsShopping.reduce((prev, current) => prev + current.count * current.price, 0);
      if (isClient) {
        localStorage.setItem(get_data, JSON.stringify(state.itemsShopping));
      }
    },

    setItemsFromLocalStorage: (state, action: PayloadAction<any[]>) => {
      state.itemsShopping = action.payload;
      state.sup_total = action.payload.reduce((prev, current) => prev + current.count * current.price, 0);
    },

    increaseCount: (state, action: PayloadAction<number>) => {
      if (state.itemsShopping[action.payload] && state.itemsShopping[action.payload].count < state.itemsShopping[action.payload].stock) {
        state.itemsShopping[action.payload].count += 1;
        state.sup_total = state.itemsShopping.reduce((prev, current) => prev + current.count * current.price, 0);
      }
    },

    decreaseCount: (state, action: PayloadAction<number>) => {
      if (state.itemsShopping[action.payload] && state.itemsShopping[action.payload].count > 1 ) {
        state.itemsShopping[action.payload].count -= 1;
        state.sup_total = state.itemsShopping.reduce((prev, current) => prev + current.count * current.price, 0);
      }
    },
  },
});

export const {
  addItemsShopping,
  removeItemsShopping,
  setShow,
  setItemsFromLocalStorage,
  increaseCount,
  decreaseCount,
} = dataShopping.actions;

export default dataShopping.reducer;
