// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice"; // default import olduğundan emin ol

export const store = configureStore({
  reducer: {
    auth: authReducer, // passing `undefined` here would cause an error
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
