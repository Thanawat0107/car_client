import { configureStore } from "@reduxjs/toolkit";
import carApi from "@/services/carApi";
import carSlice from "./slices/carSlice";
import brandSlice from "./slices/brandSlice";
import brandApi from "@/services/brandApi";

export const store = configureStore({
  reducer: {
    car: carSlice,
    brand: brandSlice,
    [carApi.reducerPath]: carApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      carApi.middleware, 
      brandApi.middleware
  ),
}); 

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
