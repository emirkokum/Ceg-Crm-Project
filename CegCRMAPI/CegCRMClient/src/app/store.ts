// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice"; // default import olduğundan emin ol

export const store = configureStore({
  reducer: {
    auth: authReducer, // burada `undefined` geçilirse hata olur
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
