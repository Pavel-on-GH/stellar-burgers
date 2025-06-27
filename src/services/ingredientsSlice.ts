import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../utils/burger-api';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined | null;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => {
    const ingredientsData = await getIngredientsApi();
    return ingredientsData;
  }
);

const pendingFunc = (state: TIngredientsState) => {
  state.isLoading = true;
  state.error = null;
};

const fulfilledFunc = (
  state: TIngredientsState,
  action: PayloadAction<TIngredient[]>
) => {
  state.ingredients = action.payload;
  state.isLoading = false;
  state.error = null;
};

const rejectedFunc = (
  state: TIngredientsState,
  action: { error: { message?: string | undefined | null } }
) => {
  state.isLoading = false;
  state.error =
    action.error.message !== null && action.error.message !== undefined
      ? action.error.message
      : 'Ошибка в запросе: ingredients';
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, pendingFunc)
      .addCase(fetchIngredients.fulfilled, fulfilledFunc)
      .addCase(fetchIngredients.rejected, rejectedFunc);
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
