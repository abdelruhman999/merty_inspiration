import { get_response_from_createOrders } from "@/calls/constant";
import {  createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountType {
  items:itemsType[]
}

const initialState: CountType = {
  items : []
};

export interface itemsType {
id: number
url:string
items: itemsType2[]
type: string
uuid: string 
is_paid: boolean
}

interface itemsType2 {
id: number
discount: number
discount_object: [] | null
product:{
  name: string
}
price: number
size_color:{
    color:{
        image:string
        name:string
    },
    size:{
        size:string
    }
}


}


export const ordersSlice = createSlice({
  name: "itemfromstorage",
  initialState,
  reducers: {
    Add_Response_Create_Order_To_Localstorage: (state , action:PayloadAction<itemsType[]>) => {
      state.items = [...state.items ,...action.payload]
      localStorage.setItem(get_response_from_createOrders ,JSON.stringify(state.items))
    },
    take_Response_Create_Order_From_LocalStorage:(state , action:PayloadAction<itemsType[] | []>)=>{
        state.items = action.payload
    }
    
  },
});

export const { Add_Response_Create_Order_To_Localstorage , take_Response_Create_Order_From_LocalStorage } = ordersSlice.actions;

export default ordersSlice.reducer;
