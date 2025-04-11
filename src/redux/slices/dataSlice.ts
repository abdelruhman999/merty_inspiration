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
      const existingIds = new Set(state.items.map(item => item.id));
      const uniqueNewItems = action.payload.filter(
        (item, index, self) => 
          !existingIds.has(item.id) && 
          self.findIndex(i => i.id === item.id) === index
      );
      state.items = [...state.items, ...uniqueNewItems];
    },
  },
});

export const { addItems  } = dataSlice.actions;

export default dataSlice.reducer;
