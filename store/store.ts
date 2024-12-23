// Importing configureStore from Redux Toolkit to set up the store
import { configureStore } from "@reduxjs/toolkit";
// Importing userReducer from userSlice to manage user-related state
import userReducer from "./slices/userSlice"; 

// Configuring the Redux store
export const store = configureStore({
  reducer: {
    user: userReducer, // Mapping the "user" slice of state to userReducer
    // Add more reducers here if needed for other parts of the state
  },
});

// Exporting RootState type to represent the overall shape of the Redux state
export type RootState = ReturnType<typeof store.getState>;

// Exporting AppDispatch type for dispatching actions in the app
export type AppDispatch = typeof store.dispatch;
