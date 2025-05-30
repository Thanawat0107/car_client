import { configureStore } from "@reduxjs/toolkit";
import carApi from "@/services/carApi";
import carSlice from "./slices/carSlice";
import brandSlice from "./slices/brandSlice";
import brandApi from "@/services/brandApi";
import authSlice from "./slices/authSlice";
import authApi from "@/services/authApi";
import sellerSlice from "./slices/sellerSlice";
import sellerApi from "@/services/sellerApi";

export const store = configureStore({
  reducer: {
    car: carSlice,
    brand: brandSlice,
    auth: authSlice,
    seller: sellerSlice,
    [carApi.reducerPath]: carApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      carApi.middleware,
      brandApi.middleware,
      authApi.middleware,
      sellerApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
