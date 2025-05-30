import { Seller } from "@/@types/dto/Seller";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SellerState {
  sellers: Seller[];
  selectedSeller?: Seller;
  loading: boolean;
  error?: string;
}

const initialState: SellerState = {
  sellers: [],
  selectedSeller: undefined,
  loading: false,
  error: undefined,
};

const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {
    setSellers(state, action: PayloadAction<Seller[]>) {
      state.sellers = action.payload;
    },
    setSelectedSeller(state, action: PayloadAction<Seller>) {
      state.selectedSeller = action.payload;
    },
    clearSelectedSeller(state) {
      state.selectedSeller = undefined;
    },
    addSeller(state, action: PayloadAction<Seller>) {
      state.sellers.push(action.payload);
    },
    updateSeller(state, action: PayloadAction<Seller>) {
      const index = state.sellers.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.sellers[index] = action.payload;
      }
    },
    deleteSeller(state, action: PayloadAction<number>) {
      state.sellers = state.sellers.filter(s => s.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
});

export const {
  setSellers,
  setSelectedSeller,
  clearSelectedSeller,
  addSeller,
  updateSeller,
  deleteSeller,
  setLoading,
  setError,
} = sellerSlice.actions;

export default sellerSlice.reducer;
