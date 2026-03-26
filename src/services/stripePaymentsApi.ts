import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { PaymentIntentResponse } from "@/@types/Responsts/PaymentIntentResponse";
import { PaymentIntentCreateDto } from "@/@types/Dto";
import { unwrapResult } from "../utility/apiHelpers";

export const stripePaymentsApi = createApi({
  reducerPath: "stripePaymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["StripePayment", "Booking", "Payment", "Car"],
  endpoints: (builder) => ({
    
    createPaymentIntent: builder.mutation<PaymentIntentResponse, PaymentIntentCreateDto>({
      query: (body) => ({
        url: "stripePayments/create-intent",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<PaymentIntentResponse>,
    }),

    refundPayment: builder.mutation<string, { transactionRef: string }>({
      query: (body) => ({
        url: "stripePayments/refund",
        method: "POST",
        body, 
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: ["Payment", "Booking", "Car"],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useRefundPaymentMutation,
} = stripePaymentsApi;

export default stripePaymentsApi;