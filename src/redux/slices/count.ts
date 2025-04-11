import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountType {
  count: number;
  next: string | null; 
}

const initialState: CountType = {
    count: 2, 
    next: null
};

export const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    increment: (state) => {
      state.count++; 
    },
      setNext: (state , action:PayloadAction<string | null>) => {
      state.next = action.payload;   
    },
  },
});

export const { increment  ,setNext } = countSlice.actions;

export default countSlice.reducer;
