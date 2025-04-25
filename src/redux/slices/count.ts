import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountType {
  count: number;
  lastrequest: number; 
  next: string | null; 
}

const initialState: CountType = {
    count: 2, 
    lastrequest: 1,
    next: null
};

export const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    increment: (state) => {
      state.count++; 
    },
    incrementRequest: (state) => {
      state.lastrequest++; 
    },
      setNext: (state , action:PayloadAction<string | null>) => {
      state.next = action.payload;   
    },

   
   
  },
});

export const { increment , incrementRequest ,setNext } = countSlice.actions;

export default countSlice.reducer;
