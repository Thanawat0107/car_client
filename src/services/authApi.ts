import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { Login } from "@/@types/Dto/Login";
import { RegisterResponse } from "@/@types/Responsts/RegisterResponse";
import { LoginResponse } from "@/@types/Responsts/LoginResponse";
import { Register } from "@/@types/Dto/Register";
import { unwrapResult } from "../utility/apiHelpers";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, Register>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<RegisterResponse>,
    }),

    login: builder.mutation<LoginResponse, Login>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<LoginResponse>,
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
export default authApi;