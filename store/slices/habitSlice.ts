import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHabits } from "../../services/habitService";

const initialState = {
  habits: [],
  status: "idle",
};

export const getHabits = createAsyncThunk(
  "habits/fetchHabits",
  async (token: string) => {
    return await fetchHabits(token);
  }
);

const habitSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHabits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHabits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.habits = action.payload;
      })
      .addCase(getHabits.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default habitSlice.reducer;
