import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Brand } from '@/types/dto/BrandDto';

interface BrandState {
  brands: Brand[];
  selectedBrand?: Brand;
  loading: boolean;
  error?: string;
}

const initialState: BrandState = {
  brands: [],
  selectedBrand: undefined,
  loading: false,
  error: undefined,
};

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands(state, action: PayloadAction<Brand[]>) {
      state.brands = action.payload;
    },
    setSelectedBrand(state, action: PayloadAction<Brand>) {
      state.selectedBrand = action.payload;
    },
    addBrand(state, action: PayloadAction<Brand>) {
      state.brands.push(action.payload);
    },
    updateBrand(state, action: PayloadAction<Brand>) {
      const index = state.brands.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },
    deleteBrand(state, action: PayloadAction<number>) {
      state.brands = state.brands.filter(b => b.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
    clearSelectedBrand(state) {
      state.selectedBrand = undefined;
    },
  },
});

export const {
  setBrands,
  setSelectedBrand,
  addBrand,
  updateBrand,
  deleteBrand,
  setLoading,
  setError,
  clearSelectedBrand,
} = brandSlice.actions;

export default brandSlice.reducer;
