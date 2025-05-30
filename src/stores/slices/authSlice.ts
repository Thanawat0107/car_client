import { SD_Roles } from "@/@types/Enum";
import { RegisterResponse } from "@/@types/Responsts/RegisterResponse";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState extends RegisterResponse {
  role: SD_Roles | "";
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userName: "",
  email: "",
  fullName: "",
  phoneNumber: "",
  role: "",
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<RegisterResponse & { token: string }>
    ) => {
      const { userName, email, fullName, phoneNumber, role, token } = action.payload;
      state.userName = userName;
      state.email = email;
      state.fullName = fullName;
      state.phoneNumber = phoneNumber;
      state.role = role as SD_Roles;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.userName = "";
      state.email = "";
      state.fullName = "";
      state.phoneNumber = "";
      state.role = "";
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;