import { configureStore } from "@reduxjs/toolkit";
// APIs
import carApi from "@/services/carApi";
import brandApi from "@/services/brandApi";
import authApi from "@/services/authApi";
import sellerApi from "@/services/sellerApi";
import testDriveApi from "@/services/testDriveApi";
import bookingsApi from "@/services/bookingsApi";
import carMaintenancesApi from "@/services/carMaintenancesApi";
import chatMessagesApi from "@/services/chatMessagesApi";
import loansApi from "@/services/loansApi";
import paymentsApi from "@/services/paymentsApi";
import reviewsApi from "@/services/reviewsApi";
import stripePaymentsApi from "@/services/stripePaymentsApi";
// Slices
import carSlice from "./slices/carSlice";
import brandSlice from "./slices/brandSlice";
import authSlice from "./slices/authSlice";
import sellerSlice from "./slices/sellerSlice";

export const store = configureStore({
  reducer: {
    // Slices
    car: carSlice,
    brand: brandSlice,
    auth: authSlice,
    seller: sellerSlice,
    // APIs
    [carApi.reducerPath]: carApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
    [testDriveApi.reducerPath]: testDriveApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [carMaintenancesApi.reducerPath]: carMaintenancesApi.reducer,
    [chatMessagesApi.reducerPath]: chatMessagesApi.reducer,
    [loansApi.reducerPath]: loansApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [stripePaymentsApi.reducerPath]: stripePaymentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      carApi.middleware,
      brandApi.middleware,
      authApi.middleware,
      sellerApi.middleware,
      testDriveApi.middleware,
      bookingsApi.middleware,
      carMaintenancesApi.middleware,
      chatMessagesApi.middleware,
      loansApi.middleware,
      paymentsApi.middleware,
      reviewsApi.middleware,
      stripePaymentsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
