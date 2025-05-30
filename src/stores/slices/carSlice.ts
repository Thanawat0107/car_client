import { Car } from "@/@types/dto/Car";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarState {
  cars: Car[];
  selectedCar?: Car;
  loading: boolean;
  error?: string;
}

const initialState: CarState = {
  cars: [],
  selectedCar: undefined,
  loading: false,
  error: undefined,
};

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<Car[]>) {
      state.cars = action.payload;
    },
    setSelectedCar(state, action: PayloadAction<Car>) {
      state.selectedCar = action.payload;
    },
    addCar(state, action: PayloadAction<Car>) {
      state.cars.push(action.payload);
    },
    updateCar(state, action: PayloadAction<Car>) {
      const index = state.cars.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cars[index] = action.payload;
      }
    },
    deleteCar(state, action: PayloadAction<number>) {
      state.cars = state.cars.filter(c => c.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
    clearSelectedCar(state) {
      state.selectedCar = undefined;
    },
  },
});

export const {
  setCars,
  setSelectedCar,
  addCar,
  updateCar,
  deleteCar,
  setLoading,
  setError,
  clearSelectedCar,
} = carSlice.actions;

export default carSlice.reducer;
