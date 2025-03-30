import { Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface DataState {
  itemsShopping: any[]; 
  show:boolean
}

const initialState: DataState = {
  itemsShopping: [], 
  show:false
};

export const dataShopping = createSlice({
  name: "dataShopping",
  initialState,
  reducers: {
    setShow:(state)=>{
      state.show = !state.show
    },
    removeItemsShopping: (state, action: PayloadAction<number>) => {
      state.itemsShopping = state.itemsShopping.filter((_, i) => i !== action.payload);
    },
    addItemsShopping: (state, action: PayloadAction<any[]>) => {
      state.itemsShopping = [...state.itemsShopping , ...action.payload]; 
    },
  },
});

export const { addItemsShopping,removeItemsShopping ,setShow} = dataShopping.actions;

export default dataShopping.reducer;
