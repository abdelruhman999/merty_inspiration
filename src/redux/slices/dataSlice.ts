import { HomeProduct, Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataState {
  items: HomeProduct[] ; 
}

const initialState: DataState = {
  items: [], 
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addItems: (state, action: PayloadAction<HomeProduct[]>) => {
      state.items = [...state.items , ...action.payload]; 
    },
  },
});

export const { addItems } = dataSlice.actions;

export default dataSlice.reducer;
