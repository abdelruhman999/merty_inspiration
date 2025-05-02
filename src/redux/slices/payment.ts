import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountType {
  show_payment: boolean;
  uuid :string
}

const initialState: CountType = {
    show_payment: false,
    uuid :"0"
};

export const show_payment = createSlice({
  name: "show_payment",
  initialState,
  reducers: {
      add_uuid : (state , action:PayloadAction<string>)=>{
          state.uuid = action.payload
        },
      setShow_payment: (state) => {
      state.show_payment = !state.show_payment;   
    },
  },
});

export const { setShow_payment  , add_uuid} = show_payment.actions;

export default show_payment.reducer;
