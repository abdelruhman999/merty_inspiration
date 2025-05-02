import { get_orders } from "@/calls/constant";
import {  createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountType {
  items:itemsType[]

}

const initialState: CountType = {
  items : [], 
  
};

interface itemsType {
        name: string,
        price: number,
}


export const ordersSlice = createSlice({
  name: "itemfromstorage",
  initialState,
  reducers: {
  
    additemstolocalstorage: (state , action:PayloadAction<itemsType[]>) => {
      state.items = action.payload
      localStorage.setItem(get_orders ,JSON.stringify(state.items))
    },
    takeItemsFormLocalStorage:(state , action:PayloadAction<itemsType[]>)=>{
        state.items = action.payload
    }
    
  },
});

export const { additemstolocalstorage  , takeItemsFormLocalStorage } = ordersSlice.actions;

export default ordersSlice.reducer;
