import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../utils/burger-api';

type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message !== null && action.error.message !== undefined
            ? action.error.message
            : 'Ошибка';
      });
  }
});

export default ingredientsSlice.reducer;
