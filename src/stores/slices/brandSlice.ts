import { BrandDto } from '@/@types/dto/BrandDto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BrandState {
  brands: BrandDto[];
  selectedBrand?: BrandDto;
  loading: boolean;
  error?: string;
}

const initialState: BrandState = {
  brands: [],
  selectedBrand: undefined,
  loading: false,
  error: undefined,
};

const BrandDtoSlice = createSlice({
  name: 'BrandDtos',
  initialState,
  reducers: {
    setBrands(state, action: PayloadAction<BrandDto[]>) {
      state.brands = action.payload;
    },
    setSelectedBrand(state, action: PayloadAction<BrandDto>) {
      state.selectedBrand = action.payload;
    },
    addBrand(state, action: PayloadAction<BrandDto>) {
      state.brands.push(action.payload);
    },
    updateBrand(state, action: PayloadAction<BrandDto>) {
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
} = BrandDtoSlice.actions;

export default BrandDtoSlice.reducer;
