import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { Login } from "@/@types/dto/Login";
import { RegisterResponse } from "@/@types/Responsts/RegisterResponse";
import { LoginResponse } from "@/@types/Responsts/LoginResponse";
import { Register } from "@/@types/dto/Register";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, Register>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<RegisterResponse>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<LoginResponse, Login>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Auth"],
    }),
    
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
export default authApi;
