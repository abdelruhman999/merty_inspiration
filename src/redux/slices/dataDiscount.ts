import { Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountType {
  count: number;
  next: string | null; 
  items : Product[] | []
}

const initialState: CountType = {
    count: 2, 
    next: null,
    items : []
};

export const counterdiscountSlice = createSlice({
  name: "counterTow",
  initialState,
  reducers: {
    incrementDiscount: (state) => {
      state.count++; 
    },
      setNext : (state , action:PayloadAction<string | null>) => {
      state.next = action.payload;   
    },
    additems : (state , action:PayloadAction<Product[] >) =>{
        state.items = state.items
    }

   
   
  },
});

export const { incrementDiscount , setNext ,  additems} = counterdiscountSlice.actions;

export default counterdiscountSlice.reducer;
